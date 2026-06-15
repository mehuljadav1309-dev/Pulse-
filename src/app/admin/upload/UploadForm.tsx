"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useCallback } from "react";
import {
  IconCloudUpload, IconFile, IconPlus, IconSparkles,
  IconX, IconBrain, IconAlertTriangle, IconCheck,
} from "@tabler/icons-react";
import { uploadMCQFile, type UploadFormState, type PreviewMCQ } from "./actions";
import { UploadPreview } from "./UploadPreview";

type Subject = { id: string; name: string; slug: string };
type Topic = { id: string; name: string; slug: string; subjectId: string };

export function UploadForm({
  subjects,
  topics,
}: {
  subjects: Subject[];
  topics: Topic[];
}) {
  const [state, formAction] = useFormState<UploadFormState, FormData>(
    uploadMCQFile,
    { status: "idle" }
  );
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [subjectId, setSubjectId] = useState<string>("");
  const [newTopic, setNewTopic] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [insertPending, setInsertPending] = useState(false);

  const filteredTopics = topics.filter((t) => t.subjectId === subjectId);
  const usingNewTopic = newTopic.trim().length > 0;
  const autoDetect = subjectId === "" && !topicId && !newTopic.trim();

  const handlePreview = useCallback(
    (fd: FormData) => {
      fd.set("mode", "preview");
      formAction(fd);
    },
    [formAction]
  );

  const handleConfirm = useCallback(
    async (selectedMCQs: PreviewMCQ[]) => {
      setInsertPending(true);
      const fd = new FormData();
      fd.set("mode", "insert");
      fd.set("subjectId", subjectId);
      fd.set("topicId", topicId);
      fd.set("newTopicName", newTopic);
      fd.set("filename", file?.name ?? "upload");
      fd.set("mcqs", JSON.stringify(selectedMCQs));
      formAction(fd);
    },
    [formAction, subjectId, topicId, newTopic, file]
  );

  const handleCancel = useCallback(() => {
    formAction(new FormData());
  }, [formAction]);

  const resetForm = useCallback(() => {
    setFile(null);
    setSubjectId("");
    setTopicId("");
    setNewTopic("");
  }, []);

  if (state.status === "preview" && state.preview) {
    return (
      <div className="upload-form">
        <UploadPreview
          mcqs={state.preview.mcqs}
          filename={state.preview.filename}
          source={state.preview.source}
          ai={state.ai ?? null}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          pending={insertPending}
        />
        {state.warnings && state.warnings.length > 0 && (
          <details className="upload-preview-warn">
            <summary>{state.warnings.length} notice(s)</summary>
            <ul>
              {state.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="upload-form">
        <div className="upload-alert upload-alert--ok">
          <div className="upload-alert__title">
            <IconCheck size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
            {state.message}
          </div>
          {(state.duplicates ?? 0) > 0 && (
            <div className="upload-alert__meta">
              Skipped {state.duplicates} duplicate
              {state.duplicates === 1 ? "" : "s"} (already in the bank).
            </div>
          )}
          {state.subjectsDetected && state.subjectsDetected.length > 0 && (
            <div className="upload-alert__subjects">
              <span className="upload-alert__label">Subjects:</span>
              {state.subjectsDetected.map((s) => (
                <span key={s} className="upload-subject-chip">{s}</span>
              ))}
            </div>
          )}
          {state.topicSummary && state.topicSummary.length > 0 && (
            <div className="upload-alert__topics">
              {state.topicSummary.map((t, i) => (
                <span
                  key={i}
                  className={
                    "upload-topic-chip" +
                    (t.createdTopic ? " upload-topic-chip--new" : "") +
                    (t.createdSubject ? " upload-topic-chip--new-subject" : "")
                  }
                >
                  <span className="upload-topic-chip__subj">{t.subject}</span>
                  <IconChevronRightMini />
                  <span>{t.topic}</span>
                  <span className="upload-topic-chip__count">{t.count}</span>
                  {t.createdTopic && <span className="upload-topic-chip__new">new</span>}
                </span>
              ))}
            </div>
          )}
          {state.warnings && state.warnings.length > 0 && (
            <details className="upload-alert-details">
              <summary>{state.warnings.length} notice(s)</summary>
              <ul>{state.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </details>
          )}
        </div>
        <button
          className="admin-btn admin-btn--primary"
          onClick={() => {
            resetForm();
            formAction(new FormData());
          }}
          style={{ marginTop: "0.75rem" }}
        >
          Upload another file
        </button>
      </div>
    );
  }

  return (
    <form action={handlePreview} className="upload-form">
      {autoDetect && (
        <div className="upload-form__autodetect">
          <IconSparkles size={14} />
          <div>
            <strong>Auto-detect mode.</strong> Subject and topic will be inferred
            from the file (CEREB iframe titles, JSON/CSV <code>topic</code> field,
            HTML <code>Topic:</code> lines, or filename keywords). Leave as-is
            unless you want to force a specific subject.
          </div>
        </div>
      )}

      <div className="upload-form__row">
        <label className="upload-field">
          <span className="upload-field__label">
            Primary subject <span className="upload-field__hint">(optional — defaults to auto-detect)</span>
          </span>
          <select
            name="subjectId"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setTopicId("");
              setNewTopic("");
            }}
            className="upload-field__input"
          >
            <option value="">Auto-detect from file</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="upload-form__row">
        <label className="upload-field">
          <span className="upload-field__label">
            Default topic{" "}
            <span className="upload-field__hint">(used if MCQ has no per-row topic)</span>
          </span>
          <select
            name="topicId"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="upload-field__input"
            disabled={!subjectId || usingNewTopic}
          >
            <option value="">
              {subjectId ? "Auto (use per-MCQ topic)" : "Pick a subject first"}
            </option>
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <label className="upload-field">
          <span className="upload-field__label">
            <IconPlus size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
            Or create a new topic
          </span>
          <input
            type="text"
            name="newTopicName"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="upload-field__input"
            placeholder={subjectId ? "e.g. ECG interpretation, ACLS algorithms…" : "Pick a subject first"}
            disabled={!subjectId}
            maxLength={80}
          />
        </label>
      </div>

      <div className="upload-form__hint">
        <strong>AI-powered:</strong> Extracts MCQs using OpenRouter (Qwen3-80B → Gemma-4 fallback).
        Questions are previewed before insertion — review confidence scores, flag issues, and edit as needed.
      </div>

      <label
        className={
          "upload-drop" + (drag ? " upload-drop--drag" : "") + (file ? " upload-drop--has" : "")
        }
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
      >
        <input
          type="file"
          name="file"
          accept=".pdf,.html,.htm,.csv,.json"
          className="upload-drop__input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        {file ? (
          <div className="upload-drop__has">
            <IconFile size={28} />
            <div>
              <div className="upload-drop__name">{file.name}</div>
              <div className="upload-drop__meta">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setFile(null); }}
              className="upload-drop__clear"
              aria-label="Remove file"
            >
              <IconX size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-drop__empty">
            <IconCloudUpload size={32} />
            <div className="upload-drop__title">Drop a file or click to browse</div>
            <div className="upload-drop__hint">
              Accepts <code>.pdf</code>, <code>.html</code>, <code>.csv</code>, <code>.json</code>
            </div>
            <div className="upload-drop__ai">
              <IconBrain size={11} /> AI-powered extraction with preview
            </div>
          </div>
        )}
      </label>

      <ExtractButton />

      {state.status === "error" && (
        <div className="upload-alert upload-alert--err">
          {state.message}
          {state.warnings && state.warnings.length > 0 && (
            <ul>{state.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          )}
        </div>
      )}
    </form>
  );
}

function IconChevronRightMini() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function ExtractButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="admin-btn admin-btn--primary upload-submit"
    >
      {pending ? (
        <>
          <span className="upload-spinner" />
          Extracting MCQs…
        </>
      ) : (
        <>
          <IconBrain size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
          Extract & Preview
        </>
      )}
    </button>
  );
}
