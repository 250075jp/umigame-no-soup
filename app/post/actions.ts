"use server";

import { redirect } from "next/navigation";
import { Type } from "@google/genai";
import pool from "@/lib/db";
import ai, { isMockAI } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/auth";

const MAX_TAGS = 3;

async function generateProblemContent(story: string) {
  if (isMockAI) {
    return {
      questionText: `（モック問題文）${story.slice(0, 20)}…という出来事があった。一体何が起きたのか？`,
      keyPoints: ["（モック要点1）", "（モック要点2）"],
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」（水平思考パズル）の出題者です。
次の「真相」をもとに、以下の2つを日本語で作ってください。

1. question_text: プレイヤーに提示する謎めいた「問題文」
2. key_points: プレイヤーが真相を言い当てたと判定するために必要な「要点」を2〜4個の短い箇条書きで

条件:
- question_textでは真相の核心（トリックや理由）を絶対に明かさないこと
- question_textは表面的な出来事だけを、不可解で興味を引く形で2〜4文程度にまとめること
- key_pointsは、真相のトリックや理由を構成する最小限の要素に分解すること（例:「無人島で遭難した」「仲間の肉をスープと言われて食べた」「後で本物の海亀のスープを飲み味の違いに気づいた」など）

真相:
${story}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question_text: { type: Type.STRING },
          key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["question_text", "key_points"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return {
    questionText: parsed.question_text as string,
    keyPoints: parsed.key_points as string[],
  };
}

export type CreateProblemState = { error?: string };

export async function createProblem(
  _prevState: CreateProblemState,
  formData: FormData
): Promise<CreateProblemState> {
  const story = (formData.get("story") as string | null)?.trim();
  const difficulty = (formData.get("difficulty") as string | null) ?? "normal";
  const tags = formData.getAll("tags").map(String).slice(0, MAX_TAGS);

  if (!story) {
    return { error: "真相を入力してください" };
  }

  let problemId: number;
  try {
    const user = await getCurrentUser();
    const { questionText, keyPoints } = await generateProblemContent(story);

    const [result] = await pool.query(
      "INSERT INTO problems (user_id, story, question_text, key_points, difficulty) VALUES (?, ?, ?, ?, ?)",
      [user?.id ?? null, story, questionText, JSON.stringify(keyPoints), difficulty]
    );
    problemId = (result as { insertId: number }).insertId;

    for (const tag of tags) {
      await pool.query(
        "INSERT INTO problem_tags (problem_id, tag) VALUES (?, ?)",
        [problemId, tag]
      );
    }
  } catch (error) {
    console.error(error);
    return { error: "問題の生成に失敗しました。もう一度お試しください。" };
  }

  redirect(`/play/${problemId}`);
}
