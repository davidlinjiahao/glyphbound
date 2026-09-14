"use client";

import { useState } from "react";
import { Knight, DioramaBackground } from "../LowPolyArt";
import GlossableText from "../GlossableText";
import { useGame } from "@/hooks/useGame";

export default function CreateScreen() {
  const { createCharacter } = useGame();
  const [name, setName] = useState("");

  return (
    <div className="relative flex flex-col h-full min-h-[100dvh]">
      <DioramaBackground />
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <Knight className="w-20 h-28 mb-4" />
        <h2 className="text-2xl font-bold text-[#1a252f] mb-2">
          <GlossableText text="创建角色" />
        </h2>
        <p className="text-sm text-[#2c3e50] mb-4">
          <GlossableText text="职业" />: <GlossableText text="剑客" />
        </p>
        <label className="w-full max-w-xs text-left text-sm font-bold text-[#1a252f] mb-1">
          <GlossableText text="名字" />
        </label>
        <input
          className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-[#2980b9] text-lg bg-white/90 mb-6 outline-none focus:border-[#f1c40f]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="旅人"
          maxLength={12}
        />
        <button
          type="button"
          className="btn-primary w-full max-w-xs"
          onClick={() => createCharacter(name)}
        >
          <GlossableText text="进入" /> <GlossableText text="新手村" />
        </button>
      </div>
    </div>
  );
}
