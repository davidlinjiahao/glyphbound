"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";

export default function DialogueScreen() {
  const { state, closeDialogue } = useGame();
  const lines = state?.dialogue ?? [];
  const [idx, setIdx] = useState(0);
  const line = lines[idx];

  if (!line) {
    return (
      <div className="flex items-center justify-center h-full min-h-[100dvh] bg-[#1a252f]">
        <button type="button" className="btn-primary" onClick={closeDialogue}>
          <GlossableText text="关闭" />
        </button>
      </div>
    );
  }

  const next = () => {
    if (idx < lines.length - 1) setIdx(idx + 1);
    else closeDialogue();
  };

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-gradient-to-b from-[#34495e] to-[#1a252f]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-24 h-24 rounded-2xl bg-[#2c3e50] border-4 border-[#f1c40f] flex items-center justify-center text-4xl">
          👤
        </div>
      </div>
      <div className="m-4 p-4 rounded-2xl bg-white/95 shadow-xl border-2 border-[#2980b9]">
        <div className="text-sm font-bold text-[#2980b9] mb-2">
          <GlossableText text={line.speaker} />
        </div>
        <p className="text-lg text-[#1a252f] leading-relaxed min-h-[3.5rem]">
          <GlossableText text={line.text} />
        </p>
        <button type="button" className="btn-primary w-full mt-4" onClick={next}>
          {idx < lines.length - 1 ? (
            <GlossableText text="继续" />
          ) : (
            <GlossableText text="好的" />
          )}
        </button>
      </div>
    </div>
  );
}
