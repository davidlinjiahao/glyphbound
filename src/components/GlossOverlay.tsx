"use client";

interface Props {
  phrase: string;
  pinyin: string;
  en: string;
  onClose: () => void;
}

export default function GlossOverlay({ phrase, pinyin, en, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-label="词义"
    >
      <div
        className="mb-8 mx-4 w-full max-w-sm rounded-2xl bg-[#2c3e50] text-white p-5 shadow-xl border-2 border-[#f1c40f]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl font-bold text-[#f1c40f] mb-1">{phrase}</div>
        <div className="text-lg text-[#85c1e9] mb-2">{pinyin}</div>
        <div className="text-base text-white/90 mb-4">{en}</div>
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-[#f1c40f] text-[#2c3e50] font-bold text-lg active:scale-95 transition"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
}
