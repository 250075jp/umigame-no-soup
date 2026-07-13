"use server";

import { redirect } from "next/navigation";
import { Type } from "@google/genai";
import pool from "@/lib/db";
import ai, { isMockAI } from "@/lib/gemini";

const MAX_TAGS = 3;

async function generateQuestionText(story: string) {
  if (isMockAI) {
    return `（モック問題文）${story.slice(0, 20)}…という出来事があった。一体何が起きたのか？`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `あなたは「ウミガメのスープ」（水平思考パズル）の出題者です。
次の「真相」をもとに、プレイヤーに提示する謎めいた「問題文」を日本語で1つ作ってください。

条件:
- 真相の核心（トリックや理由）を絶対に明かさないこと
- 表面的な出来事だけを、不可解で興味を引く形で2〜4文程度にまとめること
- 淡々とした説明文ではなく、読み手が「なぜ？」と思うような書き方にすること

真相:
${story}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question_text: { type: Type.STRING },
        },
        required: ["question_text"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return parsed.question_text as string;
}

export async function createProblem(formData: FormData) {
  const story = (formData.get("story") as string | null)?.trim();
  const difficulty = (formData.get("difficulty") as string | null) ?? "normal";
  const tags = formData.getAll("tags").map(String).slice(0, MAX_TAGS);

  if (!story) {
    throw new Error("真相を入力してください");
  }

  const questionText = await generateQuestionText(story);

  const [result] = await pool.query(
    "INSERT INTO problems (user_id, story, question_text, difficulty) VALUES (NULL, ?, ?, ?)",
    [story, questionText, difficulty]
  );
  const problemId = (result as { insertId: number }).insertId;

  for (const tag of tags) {
    await pool.query(
      "INSERT INTO problem_tags (problem_id, tag) VALUES (?, ?)",
      [problemId, tag]
    );
  }

  redirect(`/play/${problemId}`);
}
