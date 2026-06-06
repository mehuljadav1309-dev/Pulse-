"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { recordAttempt } from "../../actions";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconX,
  IconChevronRight,
  IconRefresh,
} from "@tabler/icons-react";

export type MCQ = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  difficulty: string | null;
};

const PAGE_SIZE = 50;

export function MCQSession({
  mcqs,
  subjectName,
  topicName,
}: {
  mcqs: MCQ[];
  subjectName: string;
  topicName: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);
  const [, start] = useTransition();

  const pages = useMemo(() => {
    const out: MCQ[][] = [];
    for (let i = 0; i < mcqs.length; i += PAGE_SIZE) out.push(mcqs.slice(i, i + PAGE_SIZE));
    return out;
  }, [mcqs]);

  const current = pages[page] ?? [];
  const [cursor, setCursor] = useState(0);
  const q = current[cursor];

  const total = mcqs.length;
  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(([id, idx]) => {
    const m = mcqs.find((x) => x.id === id);
    return m && m.correctIndex === idx;
  }).length;

  const onSelect = useCallback(
    (mcqId: string, idx: number) => {
      if (revealed[mcqId]) return;
      setAnswers((a) => ({ ...a, [mcqId]: idx }));
      setRevealed((r) => ({ ...r, [mcqId]: true }));
      start(async () => {
        await recordAttempt(mcqId, idx);
      });
    },
    [revealed]
  );

  const next = () => {
    if (cursor < current.length - 1) setCursor(cursor + 1);
    else if (page < pages.length - 1) {
      setPage(page + 1);
      setCursor(0);
    }
  };
  const prev = () => {
    if (cursor > 0) setCursor(cursor - 1);
    else if (page > 0) {
      setPage(page - 1);
      setCursor(pages[page - 1].length - 1);
    }
  };
  const resetPage = () => {
    if (!confirm("Reset answers on this page?")) return;
    const cleared: Record<string, number | undefined> = { ...answers };
    const rev2: Record<string, boolean> = { ...revealed };
    current.forEach((m) => {
      delete cleared[m.id];
      delete rev2[m.id];
    });
    setAnswers(cleared);
    setRevealed(rev2);
  };

  if (!q) {
    return (
      <div className="mcq-empty">
        <h2>No MCQs in this topic yet</h2>
        <p>The admin hasn&apos;t uploaded any questions for &ldquo;{topicName}&rdquo;.</p>
      </div>
    );
  }

  const sel = answers[q.id];
  const isRev = !!revealed[q.id];
  const isCorrect = sel === q.correctIndex;

  return (
    <div className="mcq-session">
      <div className="mcq-session__head">
        <div className="mcq-session__crumbs">
          <span className="mcq-session__crumb">{subjectName}</span>
          <IconChevronRight size={11} />
          <span className="mcq-session__crumb">{topicName}</span>
        </div>
        <div className="mcq-session__stats">
          <span className="mcq-session__stat">
            <IconBolt size={12} /> {answered}/{total} attempted
          </span>
          <span className="mcq-session__stat mcq-session__stat--ok">
            <IconCheck size={12} /> {correct} correct
          </span>
          <span className="mcq-session__stat">
            Page {page + 1} / {pages.length}
          </span>
        </div>
      </div>

      <div className="mcq-session__progress">
        <div
          className="mcq-session__progress-fill"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      <div className="mcq-q">
        <div className="mcq-q__head">
          <span className="mcq-q__num">Q{(page * PAGE_SIZE) + cursor + 1}.</span>
          {q.difficulty && (
            <span className={`mcq-q__diff mcq-q__diff--${q.difficulty}`}>{q.difficulty}</span>
          )}
        </div>
        <div className="mcq-q__text">{q.question}</div>

        <div className="mcq-tiles">
          {q.options.map((opt, i) => {
            const isSel = sel === i;
            const isAns = q.correctIndex === i;
            let cls = "mcq-tile";
            if (isRev) {
              if (isAns) cls += " mcq-tile--ok";
              else if (isSel) cls += " mcq-tile--bad";
              else cls += " mcq-tile--dim";
            } else if (isSel) cls += " mcq-tile--pick";
            return (
              <button
                key={i}
                className={cls}
                onClick={() => onSelect(q.id, i)}
                disabled={isRev}
              >
                <span className="mcq-tile__letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="mcq-tile__text">{opt}</span>
                {isRev && isAns && (
                  <span className="mcq-tile__badge mcq-tile__badge--ok">
                    <IconCheck size={14} />
                  </span>
                )}
                {isRev && isSel && !isAns && (
                  <span className="mcq-tile__badge mcq-tile__badge--bad">
                    <IconX size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isRev && (
          <div className={"mcq-fb " + (isCorrect ? "mcq-fb--ok" : "mcq-fb--bad")}>
            <div className="mcq-fb__head">
              {isCorrect ? (
                <>
                  <IconCheck size={14} /> Correct
                </>
              ) : (
                <>
                  <IconX size={14} /> Incorrect
                </>
              )}
              <span className="mcq-fb__ans">
                Answer: {String.fromCharCode(65 + q.correctIndex)}
              </span>
            </div>
            {q.explanation && <p className="mcq-fb__explain">{q.explanation}</p>}
          </div>
        )}

        <div className="mcq-q__nav">
          <button
            type="button"
            className="mcq-navbtn"
            onClick={prev}
            disabled={page === 0 && cursor === 0}
          >
            <IconArrowLeft size={13} /> Previous
          </button>
          <button
            type="button"
            className="mcq-navbtn mcq-navbtn--ghost"
            onClick={resetPage}
          >
            <IconRefresh size={13} /> Reset page
          </button>
          <button
            type="button"
            className="mcq-navbtn mcq-navbtn--primary"
            onClick={next}
            disabled={page === pages.length - 1 && cursor === current.length - 1}
          >
            Next <IconArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
