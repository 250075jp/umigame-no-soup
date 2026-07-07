import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCircleCheck, IconHome } from "@tabler/icons-react";
import pool from "@/lib/db";

const DIFFICULTY_STARS: Record<string, number> = {
  easy: 1,
  normal: 2,
  hard: 3,
};

function formatTime(sec: number) {
  if (sec < 60) return `${sec}秒`;
  return `${Math.floor(sec / 60)}分${sec % 60}秒`;
}

type ProblemRow = { id: number; story: string; difficulty: string };
type PlayRow = {
  question_count: number;
  clear_time_sec: number | null;
  is_cleared: number;
};

export default async function ResultPage(
  props: PageProps<"/result/[id]">
) {
  const { id } = await props.params;
  const { playId } = await props.searchParams;

  const [problemRows] = await pool.query(
    "SELECT id, story, difficulty FROM problems WHERE id = ?",
    [id]
  );
  const problem = (problemRows as ProblemRow[])[0];
  if (!problem) notFound();

  let play: PlayRow | null = null;
  if (playId) {
    const [playRows] = await pool.query(
      "SELECT question_count, clear_time_sec, is_cleared FROM plays WHERE id = ?",
      [playId]
    );
    play = (playRows as PlayRow[])[0] ?? null;
  }

  const [nextRows] = await pool.query(
    "SELECT id FROM problems WHERE id != ? ORDER BY RAND() LIMIT 1",
    [id]
  );
  const nextProblem = (nextRows as { id: number }[])[0];

  const cleared = play ? play.is_cleared === 1 : true;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <Link href="/" className="text-[#7a6a4a]">
          <IconHome className="h-5 w-5" stroke={1.5} />
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto p-6 text-center">
        <IconCircleCheck className="mt-2 h-10 w-10 text-[#c49a3a]" stroke={1.5} />
        <h1 className="text-xl font-medium text-[#e8d5a0]">
          {cleared ? "正解！" : "ギブアップ…"}
        </h1>

        <div className="flex w-full max-w-sm gap-3">
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">
              {play?.question_count ?? "-"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">質問数</div>
          </div>
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">
              {play?.clear_time_sec != null
                ? formatTime(play.clear_time_sec)
                : "-"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">クリア時間</div>
          </div>
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">
              {"★".repeat(DIFFICULTY_STARS[problem.difficulty] ?? 2)}
            </div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">難易度</div>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-xl border border-[#3d3020] bg-[#221c0e] p-4 text-left">
          <div className="mb-2 text-[11px] text-[#7a6a4a]">真相</div>
          <p className="text-[13px] leading-7 text-[#c8b880]">
            {problem.story}
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-sm shrink-0 flex-col gap-3 p-4">
        <Link
          href={nextProblem ? `/play/${nextProblem.id}` : "/problems"}
          className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-center text-[15px] font-medium text-[#1a1610]"
        >
          次の問題へ
        </Link>
        <Link
          href="/problems"
          className="w-full rounded-[10px] border border-[#3d3020] py-3 text-center text-sm text-[#c49a3a]"
        >
          問題一覧に戻る
        </Link>
      </div>
    </div>
  );
}
