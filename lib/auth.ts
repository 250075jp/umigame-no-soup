import "server-only";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export type CurrentUser = { id: number; name: string; email: string };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;

  const [rows] = await pool.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [session.userId]
  );
  return (rows as CurrentUser[])[0] ?? null;
}
