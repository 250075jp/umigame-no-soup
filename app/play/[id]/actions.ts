"use server";

import { redirect } from "next/navigation";
import { Type } from "@google/genai";
import pool from "@/lib/db";
import ai, { isMockAI } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/auth";

export type ChatMessage = {
  role: "user" | "ai";
  text: string;
  kind?: "yes" | "no" | "irrelevant" | "feedback";
};

export async function askQuestion(
  questionText: string,
  story: string,
  history: ChatMessage[],
  message: string
): Promise<{ answer: "yes" | "no" | "irrelevant" }> {
  if (isMockAI) {
    const answers = ["yes", "no", "irrelevant"] as const;
    return { answer: answers[Math.floor(Math.random() * answers.length)] };
  }

  const historyText = history
    .map((m) => (m.role === "user" ? `質問: ${m.text}` : `回答: ${m.text}`))
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」のゲームマスターです。以下の真相をもとに、プレイヤーの質問に答えてください。プレイヤーは真相を言い当てようとしているわけではなく、あくまでyes/noで答えられる質問をしています。

問題文: ${questionText}
真相（プレイヤーには非公開）: ${story}

これまでのやり取り:
${historyText || "（まだなし）"}

プレイヤーの新しい質問: ${message}

ルール:
- 真相に照らして「はい」「いいえ」「関係ない」のいずれかで判定する
- 曖昧な場合は「関係ない」を選ぶ`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING, enum: ["yes", "no", "irrelevant"] },
        },
        required: ["answer"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return { answer: parsed.answer as "yes" | "no" | "irrelevant" };
}

export async function submitAnswer(
  questionText: string,
  story: string,
  keyPoints: string[],
  history: ChatMessage[],
  guess: string
): Promise<{ correct: boolean; feedback: string }> {
  if (isMockAI) {
    const correct = guess.includes("正解");
    return {
      correct,
      feedback: correct
        ? "（モック）正解です！"
        : "（モック）まだ足りない要点があります。",
    };
  }

  const historyText = history
    .map((m) => (m.role === "user" ? `質問: ${m.text}` : `回答: ${m.text}`))
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」のゲームマスターです。プレイヤーが真相を言い当てようとしています。以下の「採点基準」を参考に、プレイヤーの回答が真相の核心を捉えているかどうかを判定してください。

問題文: ${questionText}
真相（プレイヤーには非公開）: ${story}

採点基準（真相を構成する要素。判断の参考にする）:
${keyPoints.map((k, i) => `${i + 1}. ${k}`).join("\n")}

これまでのやり取り:
${historyText || "（まだなし）"}

プレイヤーの回答: ${guess}

ルール:
- 真相の核心的なトリック・理由を的確に捉えていれば correct を true にする
- 採点基準の要点を一言一句すべて言い当てる必要はない。多少の言い回しの違いや、些細な背景描写の省略・簡略化は許容する
- ただし、トリックの根本部分を誤っている、または本質的な要素が丸ごと欠けている場合は correct を false にする
- feedbackには、正解なら短い称賛、不正解なら真相を明かさない範囲で「何が足りないか」のヒントを日本語で1〜2文で書く`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correct: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
        },
        required: ["correct", "feedback"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return { correct: !!parsed.correct, feedback: parsed.feedback as string };
}

export async function getHint(
  questionText: string,
  story: string,
  history: ChatMessage[]
): Promise<string> {
  if (isMockAI) {
    return "（モックヒント）気になる部分をもう一度整理して質問してみましょう。";
  }

  const historyText = history
    .map((m) => (m.role === "user" ? `質問: ${m.text}` : `回答: ${m.text}`))
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」のゲームマスターです。プレイヤーに小さなヒントを1つだけ日本語で与えてください。真相そのものは明かさず、次に何を質問すればよいかの方向性だけを示してください。

問題文: ${questionText}
真相（プレイヤーには非公開）: ${story}

これまでのやり取り:
${historyText || "（まだなし）"}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hint: { type: Type.STRING },
        },
        required: ["hint"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return parsed.hint as string;
}

export async function finishPlay(
  problemId: number,
  questionCount: number,
  clearTimeSec: number,
  cleared: boolean
) {
  const user = await getCurrentUser();
  const [result] = await pool.query(
    "INSERT INTO plays (user_id, problem_id, question_count, clear_time_sec, is_cleared) VALUES (?, ?, ?, ?, ?)",
    [user?.id ?? null, problemId, questionCount, clearTimeSec, cleared ? 1 : 0]
  );
  const playId = (result as { insertId: number }).insertId;
  redirect(`/result/${problemId}?playId=${playId}`);
}
