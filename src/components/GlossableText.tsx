"use client";

import { useMemo, useState } from "react";
import { lexicon, lexiconKeys } from "@/lib/data";
import GlossOverlay from "./GlossOverlay";
import { useGame } from "@/hooks/useGame";

interface Props {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}

type Token = { text: string; gloss: boolean };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const key of lexiconKeys) {
      if (text.startsWith(key, i)) {
        tokens.push({ text: key, gloss: true });
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // take one char or run of non-CJK
      const ch = text[i];
      if (/[\u4e00-\u9fff]/.test(ch)) {
        tokens.push({ text: ch, gloss: false });
        i += 1;
      } else {
        let j = i + 1;
        while (j < text.length && !/[\u4e00-\u9fff]/.test(text[j])) j++;
        tokens.push({ text: text.slice(i, j), gloss: false });
        i = j;
      }
    }
  }
  return tokens;
}

export default function GlossableText({
  text,
  className = "",
  as: Tag = "span",
}: Props) {
  const { onPeek, state } = useGame();
  const [gloss, setGloss] = useState<{
    phrase: string;
    pinyin: string;
    en: string;
  } | null>(null);

  const tokens = useMemo(() => tokenize(text), [text]);

  const handleTap = (phrase: string) => {
    const entry = lexicon[phrase];
    if (!entry) return;
    const combat = state?.combat;
    if (combat && combat.maxPeeks !== null) {
      const ok = onPeek();
      if (!ok) {
        setGloss({
          phrase: "提示",
          pinyin: "tíshì",
          en: "No peeks remaining in this trial!",
        });
        return;
      }
    } else {
      onPeek();
    }
    setGloss({ phrase, pinyin: entry.pinyin, en: entry.en });
  };

  return (
    <>
      <Tag className={className}>
        {tokens.map((t, idx) =>
          t.gloss ? (
            <button
              key={idx}
              type="button"
              className="gloss-word"
              onClick={() => handleTap(t.text)}
            >
              {t.text}
            </button>
          ) : (
            <span key={idx}>{t.text}</span>
          )
        )}
      </Tag>
      {gloss && (
        <GlossOverlay
          phrase={gloss.phrase}
          pinyin={gloss.pinyin}
          en={gloss.en}
          onClose={() => setGloss(null)}
        />
      )}
    </>
  );
}
