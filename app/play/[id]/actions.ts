"use server";

import { redirect } from "next/navigation";
import { Type } from "@google/genai";
import pool from "@/lib/db";
import ai, { isMockAI } from "@/lib/gemini";

export type ChatMessage = {
  role: "user" | "ai";
  text: string;
  kind?: "yes" | "no" | "irrelevant";
};

export async function askQuestion(
  questionText: string,
  story: string,
  history: ChatMessage[],
  message: string
): Promise<{ answer: "yes" | "no" | "irrelevant"; solved: boolean }> {
  if (isMockAI) {
    const answers = ["yes", "no", "irrelevant"] as const;
    return {
      answer: answers[Math.floor(Math.random() * answers.length)],
      solved: message.includes("正解"),
    };
  }

  const historyText = history
    .map((m) => (m.role === "user" ? `質問: ${m.text}` : `回答: ${m.text}`))
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」のゲームマスターです。以下の真相をもとに、プレイヤーの発言に答えてください。

問題文: ${questionText}
真相（プレイヤーには非公開）: ${story}

これまでのやり取り:
${historyText || "（まだなし）"}

プレイヤーの新しい発言: ${message}

ルール:
- プレイヤーの発言がyes/noで答えられる質問なら、真相に照らして「はい」「いいえ」「関係ない」のいずれかで判定する
- プレイヤーの発言が、真相の核心（トリックや理由）を実質的に言い当てている場合は solved を true にする
- 曖昧な場合は「関係ない」を選ぶ`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING, enum: ["yes", "no", "irrelevant"] },
          solved: { type: Type.BOOLEAN },
        },
        required: ["answer", "solved"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return {
    answer: parsed.answer as "yes" | "no" | "irrelevant",
    solved: !!parsed.solved,
  };
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
  const [result] = await pool.query(
    "INSERT INTO plays (user_id, problem_id, question_count, clear_time_sec, is_cleared) VALUES (NULL, ?, ?, ?, ?)",
    [problemId, questionCount, clearTimeSec, cleared ? 1 : 0]
  );
  const playId = (result as { insertId: number }).insertId;
  redirect(`/result/${problemId}?playId=${playId}`);
}
