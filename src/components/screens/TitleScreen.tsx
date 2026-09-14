"use client";

import { DioramaBackground, Knight, PineTree } from "../LowPolyArt";
import GlossableText from "../GlossableText";
import { useGame } from "@/hooks/useGame";

export default function TitleScreen() {
  const { state, go, startCreate } = useGame();
  const hasSave = state?.created;

  return (
    <div className="relative flex flex-col h-full min-h-[100dvh]">
      <DioramaBackground />
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
        <div className="flex items-end gap-2 mb-4">
          <PineTree className="w-12 h-16" />
          <Knight className="w-16 h-22 drop-shadow-lg" />
          <PineTree className="w-10 h-14" />
        </div>
        <h1 className="text-5xl font-black text-[#1a252f] drop-shadow-sm tracking-wide mb-1">
          字境
        </h1>
        <p className="text-lg text-[#2c3e50]/80 mb-1">Glyphbound</p>
        <p className="text-sm text-[#1a252f]/70 mb-8 max-w-xs">
          <GlossableText text="阅读中文，踏上冒险。任务、旅行、战斗、战利品。" />
        </p>
        {hasSave ? (
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              className="btn-primary"
              onClick={() => go("map")}
            >
              <GlossableText text="继续" />
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => startCreate()}
            >
              <GlossableText text="创建角色" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary w-full max-w-xs"
            onClick={() => go("create")}
          >
            <GlossableText text="开始" /> <GlossableText text="冒险" />
          </button>
        )}
      </div>
    </div>
  );
}
