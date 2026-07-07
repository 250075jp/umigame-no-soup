import Link from "next/link";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import pool from "@/lib/db";
import { tagLabel } from "@/lib/tags";
import { getDifficultyStars } from "@/lib/gameRules";
import RandomPlayButton from "./RandomPlayButton";

type ProblemRow = {
  id: number;
  question_text: string;
  difficulty: string;
  tags: string | null;
  play_count: number;
};

async function getProblems(): Promise<ProblemRow[]> {
  const [rows] = await pool.query(`
    SELECT p.id, p.question_text, p.difficulty,
           GROUP_CONCAT(DISTINCT pt.tag) AS tags,
           COUNT(DISTINCT pl.id) AS play_count
    FROM problems p
    LEFT JOIN problem_tags pt ON pt.problem_id = p.id
    LEFT JOIN plays pl ON pl.problem_id = p.id
    GROUP BY p.id
    ORDER BY play_count DESC, p.created_at DESC
  `);
  return rows as ProblemRow[];
}

function ProblemCard({ problem }: { problem: ProblemRow }) {
  const tags = problem.tags ? problem.tags.split(",").slice(0, 2) : [];

  return (
    <Link
      href={`/play/${problem.id}`}
      className="block rounded-xl border border-[#3d3020] bg-[#221c0e] p-3.5"
    >
      <div className="mb-1.5 text-sm font-medium text-[#e8d5a0]">
        {problem.question_text}
      </div>
      <div className="flex items-center gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]"
          >
            {tagLabel(t)}
          </span>
        ))}
        <span className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]">
          {"★".repeat(getDifficultyStars(problem.difficulty))}
        </span>
        <span className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]">
          {problem.play_count} プレイ
        </span>
        <IconChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#4a3f2a]" />
      </div>
    </Link>
  );
}

export default async function ProblemsPage() {
  const problems = await getProblems();

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <h1 className="text-[15px] font-medium text-[#e8d5a0]">問題一覧</h1>
        <div className="flex items-center gap-4">
          <Link href="/post" className="text-xs text-[#c49a3a]">
            + 投稿する
          </Link>
          <Link href="/" className="text-[#7a6a4a]">
            <IconHome className="h-5 w-5" stroke={1.5} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {problems.length === 0 ? (
          <p className="mt-4 text-center text-sm text-[#7a6a4a]">
            まだ問題がありません。投稿してみましょう。
          </p>
        ) : (
          <>
            <RandomPlayButton ids={problems.map((p) => p.id)} />
            {problems.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
