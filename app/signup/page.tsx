"use client";

import { useActionState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { signup } from "./actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, {});

  return (
    <form
      action={formAction}
      className="mx-auto flex h-dvh w-full max-w-sm flex-col"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-[#3d3020] bg-[#1a1610] px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#7a6a4a]">
            <IconArrowLeft className="h-5 w-5" stroke={1.5} />
          </Link>
          <h1 className="text-[15px] font-medium text-[#e8d5a0]">
            新規登録
          </h1>
        </div>
        <Link href="/" className="text-[#7a6a4a]">
          <IconHome className="h-5 w-5" stroke={1.5} />
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">名前</div>
          <input
            name="name"
            required
            className="w-full rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
            placeholder="ニックネーム"
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">メールアドレス</div>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">パスワード</div>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
            placeholder="8文字以上"
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-[#7a6a4a]">パスワード（確認）</div>
          <input
            name="passwordConfirm"
            type="password"
            required
            minLength={8}
            className="w-full rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a]"
            placeholder="もう一度入力してください"
          />
        </div>
        <Link href="/login" className="text-center text-xs text-[#c49a3a]">
          すでにアカウントをお持ちの方はこちら
        </Link>
      </div>

      <div className="shrink-0 border-t border-[#3d3020] bg-[#1a1610] p-4">
        {state?.error && (
          <p className="mb-2 text-xs text-[#e05050]">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-[10px] bg-[#c49a3a] py-3.5 text-[15px] font-medium text-[#1a1610] disabled:opacity-60"
        >
          {pending ? "登録中…" : "登録する"}
        </button>
      </div>
    </form>
  );
}
