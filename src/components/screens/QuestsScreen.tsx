"use client";

import { getQuest } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";
import Hud from "../Hud";
import { objectiveProgressLabel } from "@/lib/gameLogic";

export default function QuestsScreen() {
  const { state, go } = useGame();
  if (!state) return null;

  const list = state.quests.filter((q) => q.status !== "completed");
  const done = state.quests.filter((q) => q.status === "completed");

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-[#ecf0f1]">
      <Hud />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h2 className="text-xl font-black text-[#1a252f]">
          <GlossableText text="任务" />
        </h2>
        {list.map((qp) => {
          const q = getQuest(qp.questId);
          if (!q) return null;
          return (
            <div key={qp.questId} className="card">
              <div className="flex justify-between items-start">
                <div className="font-bold text-[#1a252f]">
                  <GlossableText text={q.title} />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3498db] text-white">
                  {qp.status === "available"
                    ? "可接"
                    : qp.status === "ready"
                    ? "可交"
                    : "进行中"}
                </span>
              </div>
              <p className="text-sm text-[#2c3e50] mt-1">
                <GlossableText text={q.description} />
              </p>
              {qp.status !== "available" &&
                q.objectives.map((_, idx) => (
                  <div key={idx} className="text-xs mt-1 text-[#27ae60]">
                    <GlossableText
                      text={objectiveProgressLabel(state, qp.questId, idx)}
                    />
                  </div>
                ))}
            </div>
          );
        })}
        {done.length > 0 && (
          <>
            <h3 className="text-sm font-bold text-[#7f8c8d] mt-4">
              <GlossableText text="完成" />
            </h3>
            {done.map((qp) => {
              const q = getQuest(qp.questId);
              return (
                <div key={qp.questId} className="opacity-50 text-sm px-2">
                  ✓ <GlossableText text={q?.title ?? ""} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <button
        type="button"
        className="m-3 btn-secondary"
        onClick={() => go("map")}
      >
        <GlossableText text="返回" />
      </button>
    </div>
  );
}
