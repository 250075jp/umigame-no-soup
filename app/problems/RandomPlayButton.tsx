"use client";

import { useRouter } from "next/navigation";
import { IconDice5 } from "@tabler/icons-react";

export default function RandomPlayButton({ ids }: { ids: number[] }) {
  const router = useRouter();

  const handleClick = () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    router.push(`/play/${id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#3d3020] bg-[#2a1f0a] py-2.5 text-sm text-[#c49a3a]"
    >
      <IconDice5 className="h-4 w-4" stroke={1.5} />
      ランダムに挑戦する
    </button>
  );
}
