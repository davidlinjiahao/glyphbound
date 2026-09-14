"use client";

import { nodes } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";
import { PineTree, Hill } from "../LowPolyArt";
import Hud from "../Hud";

export default function MapScreen() {
  const { state, moveTo, openNode } = useGame();
  if (!state) return null;
  const current = nodes.find((n) => n.id === state.currentNode);

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-[#2d6a4f]">
      <Hud />
      <div className="relative flex-1 overflow-hidden">
        {/* sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#74b9ff] via-[#55a3a3] to-[#40916c]" />
        <Hill className="absolute top-[20%] w-full opacity-40" color="#95d5b2" />
        <PineTree className="absolute top-[8%] left-[5%] w-8 opacity-70" />
        <PineTree className="absolute top-[12%] right-[10%] w-10 opacity-60" />

        <div className="absolute inset-0 p-2">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* connection lines */}
            {nodes.map((n) =>
              n.connections.map((cid) => {
                const t = nodes.find((x) => x.id === cid);
                if (!t || n.id > cid) return null; // draw once
                return (
                  <line
                    key={`${n.id}-${cid}`}
                    x1={n.x}
                    y1={n.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="#c4a574"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                );
              })
            )}
          </svg>

          {nodes.map((n) => {
            const isHere = n.id === state.currentNode;
            const canReach = current?.connections.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  if (isHere) openNode();
                  else if (canReach) moveTo(n.id);
                }}
                disabled={!isHere && !canReach}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition
                  ${isHere ? "z-10 scale-110" : canReach ? "z-5 opacity-100" : "opacity-40"}`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span
                  className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg shadow-md
                    ${isHere ? "bg-[#f1c40f] border-[#1a252f] animate-pulse" : "bg-[#1a252f] border-[#52be80]"}
                    ${canReach && !isHere ? "ring-2 ring-white/50" : ""}`}
                >
                  {n.type === "combat" ? "⚔" : n.type === "hub" ? "🏘" : n.type === "rest" ? "🔥" : n.type === "trial" ? "📜" : n.type === "gather" ? "🌿" : n.type === "shop" ? "🔨" : "📍"}
                </span>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-[#1a252f]/85 text-[10px] text-white font-bold whitespace-nowrap max-w-[72px] truncate">
                  {n.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative z-10 px-4 py-3 bg-[#1a252f] text-white">
        <div className="font-bold text-[#f1c40f]">
          <GlossableText text={current?.name ?? ""} />
        </div>
        <p className="text-xs text-white/70 mt-0.5">
          <GlossableText text={current?.description ?? ""} />
        </p>
        <button type="button" className="btn-primary w-full mt-2" onClick={openNode}>
          <GlossableText text="进入" />
        </button>
      </div>
    </div>
  );
}
