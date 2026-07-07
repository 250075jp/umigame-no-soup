import Link from "next/link";
import { IconCircleCheck } from "@tabler/icons-react";

export default async function ResultPage(props: PageProps<"/result/[id]">) {
  const { id } = await props.params;
  const nextId = Number(id) + 1;

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 px-6 py-8">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <IconCircleCheck className="h-10 w-10 text-[#c49a3a]" stroke={1.5} />
        <h1 className="text-xl font-medium text-[#e8d5a0]">正解！</h1>

        <div className="flex w-full gap-3">
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">23</div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">質問数</div>
          </div>
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">14分</div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">クリア時間</div>
          </div>
          <div className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] p-2.5 text-center">
            <div className="text-xl font-medium text-[#c49a3a]">★★★</div>
            <div className="mt-0.5 text-[11px] text-[#7a6a4a]">難易度</div>
          </div>
        </div>

        <div className="w-full rounded-xl border border-[#3d3020] bg-[#221c0e] p-4 text-left">
          <div className="mb-2 text-[11px] text-[#7a6a4a]">真相</div>
          <p className="text-[13px] leading-7 text-[#c8b880]">
            男はかつて無人島で遭難し、仲間から「海亀のスープ」と言われて飲んだスープがあった。しかし今日本物を飲み、あの味とは全く違うと気づいた。仲間が何を材料にしたのかを悟り、絶望して帰宅した。
          </p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3">
          <Link
            href={`/play/${nextId}`}
            className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-[15px] font-medium text-[#1a1610]"
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
    </div>
  );
}
