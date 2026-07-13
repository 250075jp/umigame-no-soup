"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string };

type UserRow = { id: number; password: string };

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  const [rows] = await pool.query(
    "SELECT id, password FROM users WHERE email = ?",
    [email]
  );
  const user = (rows as UserRow[])[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "メールアドレスまたはパスワードが違います" };
  }

  await createSession(user.id);
  redirect("/");
}
