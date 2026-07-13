import Link from "next/link";
import { IconFish } from "@tabler/icons-react";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/logout/actions";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <IconFish className="h-12 w-12 text-[#c49a3a]" stroke={1.5} />
        <h1 className="text-2xl font-medium text-[#e8d5a0]">
          AI 海亀のスープ
        </h1>
        <p className="text-sm text-[#7a6a4a]">
          いつでも1人で遊べる無限の水平思考パズル
        </p>

        <div className="mt-4 flex w-full flex-col gap-3">
          <Link
            href="/play/1"
            className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-[15px] font-medium text-[#1a1610]"
          >
            今日の問題を解く
          </Link>
          <Link
            href="/post"
            className="w-full rounded-[10px] border border-[#3d3020] py-3 text-center text-sm text-[#c49a3a]"
          >
            問題を投稿する
          </Link>
          <Link
            href="/problems"
            className="w-full rounded-[10px] border border-[#3d3020] py-3 text-center text-sm text-[#c49a3a]"
          >
            問題一覧を見る
          </Link>
        </div>

        <div className="mt-2 flex w-full items-center gap-3 text-[#3d3020]">
          <div className="h-px flex-1 bg-[#3d3020]" />
          <span className="text-xs text-[#4a3f2a]">または</span>
          <div className="h-px flex-1 bg-[#3d3020]" />
        </div>

        {user ? (
          <div className="flex w-full flex-col items-center gap-2">
            <p className="text-xs text-[#7a6a4a]">
              {user.name} としてログイン中
            </p>
            <form action={logout} className="w-full">
              <button
                type="submit"
                className="w-full rounded-[10px] border border-[#3d3020] py-3 text-sm text-[#7a6a4a]"
              >
                ログアウト
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full rounded-[10px] border border-[#3d3020] py-3 text-center text-sm text-[#7a6a4a]"
          >
            ログイン / 新規登録
          </Link>
        )}
      </div>
    </div>
  );
}
