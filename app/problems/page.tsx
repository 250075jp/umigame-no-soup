import Link from "next/link";
import {
  IconChevronRight,
  IconCircleCheckFilled,
  IconHome,
} from "@tabler/icons-react";
import RandomPlayButton from "./RandomPlayButton";

type Problem = {
  id: number;
  title: string;
  tag: string;
  difficulty: number;
  plays: number;
  cleared: boolean;
};

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: 'ある男がレストランで「海亀のスープ」を…',
    tag: "ホラー",
    difficulty: 3,
    plays: 2400,
    cleared: true,
  },
  {
    id: 2,
    title: "エレベーターで12階まで行けない男の話",
    tag: "日常",
    difficulty: 2,
    plays: 1800,
    cleared: false,
  },
  {
    id: 3,
    title: "朝、ニュースを見た女が泣き崩れた理由",
    tag: "ミステリー",
    difficulty: 2,
    plays: 320,
    cleared: false,
  },
];

function formatPlays(plays: number) {
  return plays >= 1000
    ? `${(plays / 1000).toFixed(1)}k プレイ`
    : `${plays} プレイ`;
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link
      href={`/play/${problem.id}`}
      className="block rounded-xl border border-[#3d3020] bg-[#221c0e] p-3.5"
    >
      <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#e8d5a0]">
        {problem.cleared && (
          <IconCircleCheckFilled
            className="h-4 w-4 shrink-0 text-[#5db870]"
            aria-label="クリア済み"
          />
        )}
        <span>{problem.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]">
          {problem.tag}
        </span>
        <span className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]">
          {"★".repeat(problem.difficulty)}
        </span>
        <span className="rounded-[10px] bg-[#2a1f0a] px-2 py-0.5 text-[11px] text-[#7a6a4a]">
          {formatPlays(problem.plays)}
        </span>
        <IconChevronRight className="ml-auto h-3.5 w-3.5 text-[#4a3f2a]" />
      </div>
    </Link>
  );
}

export default function ProblemsPage() {
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
        <RandomPlayButton ids={PROBLEMS.map((p) => p.id)} />

        {PROBLEMS.map((p) => (
          <ProblemCard key={p.id} problem={p} />
        ))}
      </div>
    </div>
  );
}
