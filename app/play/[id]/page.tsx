import { notFound } from "next/navigation";
import pool from "@/lib/db";
import PlayChat from "./PlayChat";

type ProblemRow = {
  id: number;
  question_text: string;
  story: string;
  difficulty: string;
};

export default async function PlayPage(props: PageProps<"/play/[id]">) {
  const { id } = await props.params;

  const [rows] = await pool.query(
    "SELECT id, question_text, story, difficulty FROM problems WHERE id = ?",
    [id]
  );
  const problem = (rows as ProblemRow[])[0];

  if (!problem) {
    notFound();
  }

  return (
    <PlayChat
      problemId={problem.id}
      questionText={problem.question_text}
      story={problem.story}
      difficulty={problem.difficulty}
    />
  );
}
