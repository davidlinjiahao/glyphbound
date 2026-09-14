"use client";
import type { CSSProperties } from "react";

/** Style B: Polytopia × Warcraft chunky geometric art */

export function PineTree({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 56" className={className} style={style} aria-hidden>
      <polygon points="20,2 32,22 8,22" fill="#1e8449" />
      <polygon points="20,12 34,32 6,32" fill="#27ae60" />
      <polygon points="20,22 36,44 4,44" fill="#196f3d" />
      <rect x="16" y="44" width="8" height="10" fill="#6e2c00" />
    </svg>
  );
}

export function Hill({ className = "", color = "#7dcea0" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden>
      <polygon points="0,40 20,18 45,28 70,8 100,22 120,14 120,40" fill={color} />
      <polygon points="0,40 25,24 50,32 75,16 120,28 120,40" fill="#52be80" opacity="0.5" />
    </svg>
  );
}

export function Knight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden>
      {/* body */}
      <polygon points="14,28 34,28 36,50 12,50" fill="#2980b9" />
      {/* head */}
      <rect x="16" y="12" width="16" height="16" rx="2" fill="#f5cba7" />
      {/* helmet */}
      <polygon points="14,14 24,6 34,14 34,18 14,18" fill="#85929e" />
      {/* plume */}
      <polygon points="22,6 26,6 28,0 20,0" fill="#e74c3c" />
      {/* sword */}
      <rect x="36" y="20" width="4" height="28" fill="#bdc3c7" />
      <rect x="34" y="44" width="8" height="4" fill="#f1c40f" />
      {/* legs */}
      <rect x="14" y="50" width="8" height="12" fill="#1a5276" />
      <rect x="26" y="50" width="8" height="12" fill="#1a5276" />
      {/* shield */}
      <polygon points="8,30 16,28 16,46 8,44" fill="#e74c3c" />
      <circle cx="12" cy="37" r="2" fill="#f1c40f" />
    </svg>
  );
}

export function WolfSprite({ className = "", color = "#7f8c8d" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      <polygon points="10,28 20,12 40,10 54,20 50,32 18,34" fill={color} />
      <polygon points="40,10 48,2 54,12" fill={color} />
      <polygon points="48,2 56,4 54,12" fill="#566573" />
      <circle cx="50" cy="16" r="2" fill="#e74c3c" />
      <polygon points="54,18 62,20 54,22" fill="#ecf0f1" />
      <rect x="16" y="32" width="5" height="8" fill="#5d6d7e" />
      <rect x="28" y="32" width="5" height="8" fill="#5d6d7e" />
      <rect x="38" y="30" width="5" height="8" fill="#5d6d7e" />
      <rect x="46" y="30" width="5" height="8" fill="#5d6d7e" />
    </svg>
  );
}

export function GolemSprite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 64" className={className} aria-hidden>
      <polygon points="12,20 44,20 48,56 8,56" fill="#95a5a6" />
      <polygon points="16,8 40,8 44,22 12,22" fill="#7f8c8d" />
      <rect x="18" y="28" width="8" height="8" fill="#e74c3c" />
      <rect x="30" y="28" width="8" height="8" fill="#e74c3c" />
      <polygon points="4,24 12,28 12,44 4,40" fill="#bdc3c7" />
      <polygon points="44,28 52,24 52,40 44,44" fill="#bdc3c7" />
      <rect x="14" y="56" width="10" height="8" fill="#5d6d7e" />
      <rect x="32" y="56" width="10" height="8" fill="#5d6d7e" />
    </svg>
  );
}

export function BoarSprite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 36" className={className} aria-hidden>
      <ellipse cx="28" cy="20" rx="22" ry="12" fill="#8B4513" />
      <circle cx="46" cy="16" r="8" fill="#A0522D" />
      <polygon points="50,14 56,10 54,18" fill="#ecf0f1" />
      <polygon points="50,18 56,22 54,16" fill="#ecf0f1" />
      <circle cx="48" cy="14" r="1.5" fill="#1a1a1a" />
      <rect x="14" y="28" width="6" height="8" fill="#5d4037" />
      <rect x="34" y="28" width="6" height="8" fill="#5d4037" />
    </svg>
  );
}

export function BanditSprite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden>
      <polygon points="12,24 28,24 30,48 10,48" fill="#c0392b" />
      <rect x="13" y="10" width="14" height="14" fill="#f5cba7" />
      <rect x="12" y="8" width="16" height="6" fill="#2c3e50" />
      <rect x="12" y="48" width="6" height="12" fill="#1a1a1a" />
      <rect x="22" y="48" width="6" height="12" fill="#1a1a1a" />
      <rect x="28" y="28" width="3" height="18" fill="#bdc3c7" />
    </svg>
  );
}

export function TreeSpiritSprite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden>
      <rect x="18" y="28" width="12" height="28" fill="#6e2c00" />
      <polygon points="24,4 40,28 8,28" fill="#27ae60" />
      <polygon points="24,14 42,36 6,36" fill="#1e8449" />
      <circle cx="18" cy="24" r="3" fill="#f1c40f" />
      <circle cx="30" cy="24" r="3" fill="#f1c40f" />
    </svg>
  );
}

export function EnemyArt({
  shape,
  color,
  className = "",
}: {
  shape: string;
  color?: string;
  className?: string;
}) {
  switch (shape) {
    case "wolf":
      return <WolfSprite className={className} color={color} />;
    case "golem":
      return <GolemSprite className={className} />;
    case "boar":
      return <BoarSprite className={className} />;
    case "bandit":
      return <BanditSprite className={className} />;
    case "tree":
      return <TreeSpiritSprite className={className} />;
    default:
      return <WolfSprite className={className} color={color} />;
  }
}

export function DioramaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#5dade2] via-[#aed6f1] to-[#f5cba7]" />
      <Hill className="absolute bottom-[28%] left-0 w-full opacity-80" color="#7dcea0" />
      <Hill className="absolute bottom-[18%] left-[-10%] w-[120%] opacity-90" color="#52be80" />
      <PineTree className="absolute bottom-[22%] left-[4%] w-10 opacity-90" />
      <PineTree className="absolute bottom-[20%] left-[14%] w-14" />
      <PineTree className="absolute bottom-[22%] right-[8%] w-12" />
      <PineTree className="absolute bottom-[18%] right-[20%] w-8 opacity-80" />
      {/* dirt path */}
      <svg className="absolute bottom-0 left-0 w-full h-[35%]" viewBox="0 0 100 40" preserveAspectRatio="none">
        <polygon points="35,0 65,0 80,40 20,40" fill="#c4a574" />
        <polygon points="40,0 60,0 70,40 30,40" fill="#d4b896" opacity="0.6" />
      </svg>
    </div>
  );
}
