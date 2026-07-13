"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { createSession } from "@/lib/session";

export type SignupState = { error?: string };

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;

  if (!name || !email || !password) {
    return { error: "すべての項目を入力してください" };
  }
  if (password.length < 8) {
    return { error: "パスワードは8文字以上にしてください" };
  }

  const [existingRows] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if ((existingRows as unknown[]).length > 0) {
    return { error: "そのメールアドレスは既に登録されています" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );
  const userId = (result as { insertId: number }).insertId;

  await createSession(userId);
  redirect("/");
}
