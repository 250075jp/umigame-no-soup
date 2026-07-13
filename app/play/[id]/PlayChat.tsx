"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconBulb,
  IconCheck,
  IconHome,
  IconSend2,
} from "@tabler/icons-react";
import {
  askQuestion,
  finishPlay,
  getHint,
  submitAnswer,
  type ChatMessage,
} from "./actions";
import { getQuestionLimit } from "@/lib/gameRules";

const ANSWER_LABEL: Record<string, string> = {
  yes: "はい",
  no: "いいえ",
  irrelevant: "関係ない",
};

const ANSWER_CLASS: Record<string, string> = {
  yes: "border-[#2d5030] bg-[#1d3020] text-[#5db870]",
  no: "border-[#5a2020] bg-[#301a1a] text-[#e05050]",
  irrelevant: "border-[#203050] bg-[#1a2030] text-[#6090c0]",
};

export default function PlayChat({
  problemId,
  questionText,
  story,
  keyPoints,
  difficulty,
}: {
  problemId: number;
  questionText: string;
  story: string;
  keyPoints: string[];
  difficulty: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [isSending, startSending] = useTransition();
  const [isHintLoading, startHintLoading] = useTransition();
  const startTimeRef = useRef(Date.now());
  const questionLimit = getQuestionLimit(difficulty);
  const questionCount = messages.filter((m) => m.role === "user").length;

  const elapsedSeconds = () =>
    Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

  const checkLimit = async (nextMessages: ChatMessage[]) => {
    const nextCount = nextMessages.filter((m) => m.role === "user").length;
    if (nextCount >= questionLimit) {
      await finishPlay(problemId, nextCount, elapsedSeconds(), false);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");

    startSending(async () => {
      const history = messages;
      const userMessage: ChatMessage = { role: "user", text };
      const result = await askQuestion(questionText, story, history, text);

      const aiMessage: ChatMessage = {
        role: "ai",
        text: ANSWER_LABEL[result.answer],
        kind: result.answer,
      };
      const nextMessages = [...history, userMessage, aiMessage];
      setMessages(nextMessages);
      await checkLimit(nextMessages);
    });
  };

  const handleAnswer = () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");

    startSending(async () => {
      const history = messages;
      const userMessage: ChatMessage = { role: "user", text };
      const result = await submitAnswer(
        questionText,
        story,
        keyPoints,
        history,
        text
      );

      if (result.correct) {
        const nextCount =
          history.filter((m) => m.role === "user").length + 1;
        await finishPlay(problemId, nextCount, elapsedSeconds(), true);
        return;
      }

      const aiMessage: ChatMessage = {
        role: "ai",
        text: result.feedback,
        kind: "feedback",
      };
      const nextMessages = [...history, userMessage, aiMessage];
      setMessages(nextMessages);
      await checkLimit(nextMessages);
    });
  };

  const handleHint = () => {
    if (isHintLoading) return;
    startHintLoading(async () => {
      const text = await getHint(questionText, story, messages);
      setHint(text);
    });
  };

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
          問題 #{problemId}（{questionCount} / {questionLimit}）
        </div>
        <button
          type="button"
          onClick={handleHint}
          disabled={isHintLoading}
          className="text-[#c49a3a] disabled:opacity-50"
        >
          <IconBulb className="h-5 w-5" stroke={1.5} />
        </button>
      </header>

      <div className="shrink-0 border-b border-[#3d3020] bg-[#221c0e] p-4">
        <div className="mb-2 text-xs text-[#7a6a4a]">問題</div>
        <p className="text-sm leading-7 text-[#e8d5a0]">{questionText}</p>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <div
                key={i}
                className="max-w-[80%] self-end rounded-[14px] rounded-br-[2px] border border-[#3d3020] bg-[#2a1f0a] px-3.5 py-2.5 text-[13px] text-[#e8d5a0]"
              >
                {m.text}
              </div>
            );
          }
          if (m.kind === "feedback") {
            return (
              <div
                key={i}
                className="max-w-[85%] self-start rounded-lg border border-[#3d3020] bg-[#221c0e] px-3.5 py-2.5 text-[13px] leading-6 text-[#c8b880]"
              >
                {m.text}
              </div>
            );
          }
          return (
            <div key={i} className="max-w-[80%] self-start">
              <span
                className={`inline-block rounded-full border px-4 py-2 text-sm font-medium ${ANSWER_CLASS[m.kind ?? "irrelevant"]}`}
              >
                {m.text}
              </span>
            </div>
          );
        })}
        {isSending && (
          <div className="max-w-[80%] self-start text-xs text-[#7a6a4a]">
            考え中…
          </div>
        )}
      </div>

      {hint && (
        <div className="mx-4 mb-2 flex shrink-0 items-start gap-1.5 rounded-lg border border-[#203050] bg-[#1a2030] px-3 py-2 text-xs text-[#6090c0]">
          <IconBulb className="mt-0.5 h-3.5 w-3.5 shrink-0" stroke={1.5} />
          {hint}
        </div>
      )}

      <div className="mx-4 mb-4 flex shrink-0 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={isSending}
          className="flex-1 rounded-[10px] border border-[#3d3020] bg-[#221c0e] px-3 py-2.5 text-[13px] text-[#e8d5a0] placeholder:text-[#4a3f2a] disabled:opacity-60"
          placeholder="質問を入力…"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          title="質問する"
          className="rounded-[10px] bg-[#c49a3a] px-3.5 py-2.5 text-[#1a1610] disabled:opacity-60"
        >
          <IconSend2 className="h-4 w-4" stroke={1.5} />
        </button>
        <button
          type="button"
          onClick={handleAnswer}
          disabled={isSending}
          title="真相を答える"
          className="rounded-[10px] border border-[#2d5030] bg-[#1d3020] px-3.5 py-2.5 text-[#5db870] disabled:opacity-60"
        >
          <IconCheck className="h-4 w-4" stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
