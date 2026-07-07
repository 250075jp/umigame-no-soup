"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

const DIFFICULTIES = [
  { value: "easy", label: "やさしい" },
  { value: "normal", label: "ふつう" },
  { value: "hard", label: "むずかしい" },
];

const TAGS = [
  { value: "horror", label: "ホラー" },
  { value: "mystery", label: "ミステリー" },
  { value: "suspense", label: "サスペンス" },
  { value: "fantasy", label: "ファンタジー" },
  { value: "sf", label: "SF" },
  { value: "history", label: "歴史" },
  { value: "romance", label: "恋愛" },
  { value: "youth", label: "青春" },
  { value: "daily", label: "日常" },
  { value: "school", label: "学校" },
  { value: "work", label: "仕事" },
  { value: "travel", label: "旅行" },
  { value: "food", label: "グルメ" },
  { value: "sports", label: "スポーツ" },
  { value: "true_story", label: "実話" },
];

const MAX_TAGS = 3;

export default function PostPage() {
  const [difficulty, setDifficulty] = useState("normal");
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (value: string) => {
    setTags((prev) => {
      if (prev.includes(value)) return prev.filter((t) => t !== value);
      if (prev.length >= MAX_TAGS) return prev;
      return [...prev, value];
    });
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <Link href="/" className="text-[#7a6a4a]">
          <IconArrowLeft className="h-5 w-5" stroke={1.5} />
        </Link>
        <h1 className="text-[15px] font-medium text-[#e8d5a0]">
          真相を投稿する
        </h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">真相（ネタバレ）</div>
          <textarea
            className="min-h-[140px] w-full resize-none rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
            placeholder="答えとなる真相を書いてください。AIが問題文を自動生成します。"
          />
          <div className="mt-1 text-[11px] text-[#4a3f2a]">
            問題文はAIが自動で生成します
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs text-[#7a6a4a]">難易度</div>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  difficulty === d.value
                    ? "border-[#c49a3a] bg-[#2a1f0a] text-[#c49a3a]"
                    : "border-[#3d3020] bg-[#2a1f0a] text-[#7a6a4a]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-[#7a6a4a]">
            <span>タグ（最大{MAX_TAGS}つ）</span>
            <span>
              {tags.length} / {MAX_TAGS}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => {
              const selected = tags.includes(t.value);
              const disabled = !selected && tags.length >= MAX_TAGS;
              return (
                <button
                  key={t.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTag(t.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    selected
                      ? "border-[#c49a3a] bg-[#2a1f0a] text-[#c49a3a]"
                      : disabled
                        ? "border-[#3d3020] bg-[#2a1f0a] text-[#4a3f2a] opacity-50"
                        : "border-[#3d3020] bg-[#2a1f0a] text-[#7a6a4a]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#3d3020] bg-[#1a1610] p-4">
        <button
          type="button"
          className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-[15px] font-medium text-[#1a1610]"
        >
          投稿してAIに問題を作らせる
        </button>
      </div>
    </div>
  );
}
