"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { createProblem } from "./actions";
import { TAGS } from "@/lib/tags";

const DIFFICULTIES = [
  { value: "easy", label: "やさしい" },
  { value: "normal", label: "ふつう" },
  { value: "hard", label: "むずかしい" },
];

const MAX_TAGS = 3;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-[15px] font-medium text-[#1a1610] disabled:opacity-60"
    >
      {pending ? "AIが問題文を生成中…" : "投稿してAIに問題を作らせる"}
    </button>
  );
}

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
    <form action={createProblem} className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/problems" className="text-[#7a6a4a]">
            <IconArrowLeft className="h-5 w-5" stroke={1.5} />
          </Link>
          <h1 className="text-[15px] font-medium text-[#e8d5a0]">
            真相を投稿する
          </h1>
        </div>
        <Link href="/" className="text-[#7a6a4a]">
          <IconHome className="h-5 w-5" stroke={1.5} />
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">真相（ネタバレ）</div>
          <textarea
            name="story"
            required
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

      <input type="hidden" name="difficulty" value={difficulty} />
      {tags.map((t) => (
        <input key={t} type="hidden" name="tags" value={t} />
      ))}

      <div className="shrink-0 border-t border-[#3d3020] bg-[#1a1610] p-4">
        <SubmitButton />
      </div>
    </form>
  );
}
