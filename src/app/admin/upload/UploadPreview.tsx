"use client";

import { useState } from "react";
import {
  IconBrain, IconAlertTriangle, IconCheck, IconX,
  IconEdit, IconTrash, IconChevronDown, IconChevronRight,
  IconFilter, IconDotsVertical,
} from "@tabler/icons-react";
import type { PreviewMCQ } from "./actions";

type UploadPreviewProps = {
  mcqs: PreviewMCQ[];
  filename: string;
  source: string;
  ai?: {
    model: string;
    usedFallback: boolean;
    durationMs: number;
    estimatedQuestionCount: number;
    documentType: string;
    needsReviewCount: number;
  } | null;
  onConfirm: (mcqs: PreviewMCQ[]) => void;
  onCancel: () => void;
  pending?: boolean;
};

type FilterMode = "all" | "review" | "high" | "low";

export function UploadPreview({
  mcqs,
  filename,
  source,
  ai,
  onConfirm,
  onCancel,
  pending,
}: UploadPreviewProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set(mcqs.map((m) => m.uid)));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<PreviewMCQ | null>(null);

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="upload-preview upload-preview--empty">
        <p>No MCQs to preview.</p>
        <button className="admin-btn" onClick={onCancel}>Go back</button>
      </div>
    );
  }

  const needsReview = mcqs.filter((m) => m.aiNeedsReview);
  const highConfidence = mcqs.filter((m) => (m.aiConfidence ?? 100) >= 85);
  const lowConfidence = mcqs.filter((m) => (m.aiConfidence ?? 100) < 85);

  const filtered = mcqs.filter((m) => {
    if (filter === "review") return m.aiNeedsReview;
    if (filter === "high") return (m.aiConfidence ?? 100) >= 85;
    if (filter === "low") return (m.aiConfidence ?? 100) < 85;
    return true;
  });

  const toggleSelect = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const toggleExpand = (uid: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const startEdit = (m: PreviewMCQ) => {
    setEditingId(m.uid);
    setEditData({ ...m });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (!editData) return;
    const idx = mcqs.findIndex((m) => m.uid === editData.uid);
    if (idx === -1) return;
    mcqs[idx] = editData;
    setEditingId(null);
    setEditData(null);
  };

  const removeMCQ = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(uid);
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedMCQs = mcqs.filter((m) => selected.has(m.uid));
    onConfirm(selectedMCQs);
  };

  const allSelected = filtered.every((m) => selected.has(m.uid));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(mcqs.map((m) => m.uid)));
    }
  };

  return (
    <div className="upload-preview">
      <div className="upload-preview__head">
        <div className="upload-preview__head-left">
          <h3 className="upload-preview__title">
            Review MCQs from <span className="upload-preview__filename">{filename}</span>
          </h3>
          <div className="upload-preview__meta">
            <span className="upload-preview__stat">{mcqs.length} extracted</span>
            <span className="upload-preview__sep">·</span>
            <span className="upload-preview__stat">{source.toUpperCase()}</span>
            {needsReview.length > 0 && (
              <>
                <span className="upload-preview__sep">·</span>
                <span className="upload-preview__stat upload-preview__stat--warn">
                  <IconAlertTriangle size={12} /> {needsReview.length} flagged
                </span>
              </>
            )}
          </div>
        </div>
        {ai && (
          <div className="upload-preview__ai">
            <IconBrain size={14} />
            <span className="upload-preview__ai-model">{ai.model}</span>
            <span className="upload-preview__ai-dur">{(ai.durationMs / 1000).toFixed(1)}s</span>
            {ai.usedFallback && <span className="upload-preview__ai-fb">fallback</span>}
          </div>
        )}
      </div>

      <div className="upload-preview__toolbar">
        <div className="upload-preview__filters">
          <button
            className={`upload-preview__filter${filter === "all" ? " upload-preview__filter--on" : ""}`}
            onClick={() => setFilter("all")}
          >
            <IconFilter size={12} /> All ({mcqs.length})
          </button>
          {needsReview.length > 0 && (
            <button
              className={`upload-preview__filter${filter === "review" ? " upload-preview__filter--on" : ""}`}
              onClick={() => setFilter("review")}
            >
              <IconAlertTriangle size={12} /> Needs Review ({needsReview.length})
            </button>
          )}
          <button
            className={`upload-preview__filter${filter === "high" ? " upload-preview__filter--on" : ""}`}
            onClick={() => setFilter("high")}
          >
            <IconCheck size={12} /> High Confidence ({highConfidence.length})
          </button>
          <button
            className={`upload-preview__filter${filter === "low" ? " upload-preview__filter--on" : ""}`}
            onClick={() => setFilter("low")}
          >
            <IconX size={12} /> Low Confidence ({lowConfidence.length})
          </button>
        </div>
        <label className="upload-preview__select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />
          <span>{allSelected ? "Deselect all" : "Select all"}</span>
        </label>
      </div>

      <div className="upload-preview__list">
        {filtered.length === 0 ? (
          <div className="upload-preview__empty">No MCQs match this filter.</div>
        ) : (
          filtered.map((m, i) => {
            const isExpanded = expanded.has(m.uid);
            const isSelected = selected.has(m.uid);
            const isEditing = editingId === m.uid;
            const confidence = m.aiConfidence ?? 100;
            const needsRev = m.aiNeedsReview ?? false;
            const alpha = "ABCDEFGHIJ".split("");

            return (
              <div
                key={m.uid}
                className={
                  "upload-preview__card" +
                  (needsRev ? " upload-preview__card--warn" : "") +
                  (confidence < 85 ? " upload-preview__card--low" : "") +
                  (!isSelected ? " upload-preview__card--excluded" : "")
                }
              >
                <div className="upload-preview__card-head">
                  <label className="upload-preview__checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(m.uid)}
                    />
                  </label>
                  <span className="upload-preview__num">{i + 1}</span>
                  {m.aiConfidence !== undefined && (
                    <div
                      className="upload-preview__conf"
                      title={`AI Confidence: ${confidence}%`}
                    >
                      <div className="upload-preview__conf-bar">
                        <div
                          className={
                            "upload-preview__conf-fill" +
                            (confidence >= 85 ? " upload-preview__conf-fill--high" :
                             confidence >= 60 ? " upload-preview__conf-fill--mid" :
                             " upload-preview__conf-fill--low")
                          }
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                      <span className="upload-preview__conf-val">{confidence}%</span>
                    </div>
                  )}
                  <div className="upload-preview__card-meta">
                    {m.subject && <span className="upload-preview__subject">{m.subject}</span>}
                    {m.topic && <span className="upload-preview__topic">{m.topic}</span>}
                  </div>
                  <div className="upload-preview__card-actions">
                    {needsRev && (
                      <span className="upload-preview__flag" title="Needs review">
                        <IconAlertTriangle size={14} />
                      </span>
                    )}
                    <button
                      className="upload-preview__action"
                      onClick={() => toggleExpand(m.uid)}
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                    </button>
                    <button
                      className="upload-preview__action"
                      onClick={() => startEdit(m)}
                      title="Edit"
                    >
                      <IconEdit size={14} />
                    </button>
                    <button
                      className="upload-preview__action upload-preview__action--danger"
                      onClick={() => removeMCQ(m.uid)}
                      title="Exclude"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>

                {isEditing && editData ? (
                  <div className="upload-preview__edit">
                    <label className="upload-preview__edit-field">
                      <span>Question</span>
                      <textarea
                        value={editData.question}
                        onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                        rows={3}
                      />
                    </label>
                    {editData.options.map((opt, oi) => (
                      <label key={oi} className="upload-preview__edit-field">
                        <span>
                          Option {alpha[oi]}
                          {oi === editData.correctIndex && (
                            <span className="upload-preview__edit-correct"> (correct)</span>
                          )}
                        </span>
                        <div className="upload-preview__edit-opt-row">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const opts = [...editData.options];
                              opts[oi] = e.target.value;
                              setEditData({ ...editData, options: opts });
                            }}
                          />
                          <button
                            className="upload-preview__edit-mark"
                            onClick={() => setEditData({ ...editData, correctIndex: oi })}
                            title="Mark as correct"
                          >
                            {oi === editData.correctIndex ? <IconCheck size={14} /> : <IconDotsVertical size={14} />}
                          </button>
                        </div>
                      </label>
                    ))}
                    <label className="upload-preview__edit-field">
                      <span>Explanation</span>
                      <textarea
                        value={editData.explanation ?? ""}
                        onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
                        rows={2}
                      />
                    </label>
                    <div className="upload-preview__edit-actions">
                      <button className="admin-btn admin-btn--primary" onClick={saveEdit}>
                        Save
                      </button>
                      <button className="admin-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-preview__card-body">
                    <div className="upload-preview__q">
                      {isExpanded ? m.question : m.question.length > 120 ? m.question.slice(0, 120) + "…" : m.question}
                    </div>
                    {isExpanded && (
                      <div className="upload-preview__opts">
                        {m.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={
                              "upload-preview__opt" +
                              (oi === m.correctIndex ? " upload-preview__opt--correct" : "")
                            }
                          >
                            <span className="upload-preview__opt-letter">{alpha[oi]}.</span>
                            <span>{opt}</span>
                            {oi === m.correctIndex && (
                              <span className="upload-preview__opt-check">
                                <IconCheck size={12} />
                              </span>
                            )}
                          </div>
                        ))}
                        {m.explanation && (
                          <div className="upload-preview__explain">
                            <strong>Explanation:</strong> {m.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="upload-preview__footer">
        <div className="upload-preview__summary">
          <span className="upload-preview__summary-item">
            Selected: <strong>{selected.size}</strong> / {mcqs.length}
          </span>
          <span className="upload-preview__summary-item">
            Flagged: <strong>{needsReview.length}</strong>
          </span>
          {ai && (
            <span className="upload-preview__summary-item">
              AI: <strong>{ai.model}</strong>
            </span>
          )}
        </div>
        <div className="upload-preview__footer-actions">
          <button className="admin-btn" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
          <button
            className="admin-btn admin-btn--primary upload-preview__confirm"
            onClick={handleConfirm}
            disabled={selected.size === 0 || pending}
          >
            {pending
              ? "Inserting…"
              : `Insert ${selected.size} MCQ${selected.size === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
