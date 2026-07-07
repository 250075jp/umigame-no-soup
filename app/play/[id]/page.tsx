import Link from "next/link";
import { IconArrowLeft, IconBulb, IconHome, IconSend2 } from "@tabler/icons-react";

export default async function PlayPage(props: PageProps<"/play/[id]">) {
  const { id } = await props.params;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <div className="flex items-center gap-3 text-[#7a6a4a]">
          <Link href="/problems">
            <IconArrowLeft className="h-5 w-5" stroke={1.5} />
          </Link>
          <Link href="/">
            <IconHome className="h-5 w-5" stroke={1.5} />
          </Link>
        </div>
        <div className="rounded-full border border-[#3d3020] bg-[#2a1f0a] px-3 py-1 text-xs text-[#c49a3a]">
          問題 #{id}
        </div>
        <IconBulb className="h-5 w-5 text-[#c49a3a]" stroke={1.5} />
      </header>

      <div className="shrink-0 border-b border-[#3d3020] bg-[#221c0e] p-4">
        <div className="mb-2 text-xs text-[#7a6a4a]">問題</div>
        <p className="text-sm leading-7 text-[#e8d5a0]">
          ある男が、レストランで「海亀のスープ」を注文した。一口飲んだ彼は、料理人を呼び、勘定を払って家に帰り、自殺した。なぜか？
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        <div className="max-w-[80%] self-end rounded-[14px] rounded-br-[2px] border border-[#3d3020] bg-[#2a1f0a] px-3.5 py-2.5 text-[13px] text-[#e8d5a0]">
          その男は以前も海亀のスープを飲んだことがありますか？
        </div>
        <div className="max-w-[80%] self-start">
          <span className="inline-block rounded-full border border-[#2d5030] bg-[#1d3020] px-4 py-2 text-sm font-medium text-[#5db870]">
            はい
          </span>
        </div>
        <div className="max-w-[80%] self-end rounded-[14px] rounded-br-[2px] border border-[#3d3020] bg-[#2a1f0a] px-3.5 py-2.5 text-[13px] text-[#e8d5a0]">
          本物のスープではなかった？
        </div>
        <div className="max-w-[80%] self-start">
          <span className="inline-block rounded-full border border-[#5a2020] bg-[#301a1a] px-4 py-2 text-sm font-medium text-[#e05050]">
            いいえ
          </span>
        </div>
      </div>

      <div className="mx-4 mb-2 flex shrink-0 items-center gap-1.5 rounded-lg border border-[#203050] bg-[#1a2030] px-3 py-2 text-xs text-[#6090c0]">
        <IconBulb className="h-3.5 w-3.5 shrink-0" stroke={1.5} />
        「以前どこで飲んだか」について質問してみましょう
      </div>

      <div className="mx-4 mb-4 flex shrink-0 gap-2">
        <input
          className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
          placeholder="質問を入力…"
        />
        <button
          type="button"
          className="rounded-[10px] bg-[#c49a3a] px-3.5 py-2.5 text-[#1a1610]"
        >
          <IconSend2 className="h-4 w-4" stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
