"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { IconCloudUpload, IconFile, IconPlus, IconX } from "@tabler/icons-react";
import { uploadMCQFile, type UploadFormState } from "./actions";

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

  const filteredTopics = topics.filter((t) => t.subjectId === subjectId);
  const usingNewTopic = newTopic.trim().length > 0;

  return (
    <form action={formAction} className="upload-form">
      <div className="upload-form__row">
        <label className="upload-field">
          <span className="upload-field__label">Subject</span>
          <select
            name="subjectId"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setTopicId("");
              setNewTopic("");
            }}
            className="upload-field__input"
            required
          >
            <option value="">Choose a subject…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="upload-form__row">
        <label className="upload-field">
          <span className="upload-field__label">
            Existing topic
            {usingNewTopic && <span className="upload-field__hint"> (ignored — using new topic below)</span>}
          </span>
          <select
            name="topicId"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="upload-field__input"
            disabled={!subjectId || usingNewTopic}
          >
            <option value="">
              {subjectId ? "Choose an existing topic…" : "Pick a subject first"}
            </option>
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
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
            placeholder={
              subjectId
                ? "e.g. ECG interpretation, ACLS algorithms…"
                : "Pick a subject first"
            }
            disabled={!subjectId}
            maxLength={80}
          />
        </label>
      </div>

      <div className="upload-form__hint">
        <strong>Tip:</strong> if your file contains a <code>topic</code> (JSON/CSV) or
        <code> Topic:</code> / <code>Chapter:</code> lines (HTML/PDF), each MCQ will
        be routed to its own topic automatically. Otherwise all MCQs will be saved
        under the topic you pick or create here.
      </div>

      <label
        className={
          "upload-drop" + (drag ? " upload-drop--drag" : "") + (file ? " upload-drop--has" : "")
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
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
              <div className="upload-drop__meta">
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
              }}
              className="upload-drop__clear"
              aria-label="Remove file"
            >
              <IconX size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-drop__empty">
            <IconCloudUpload size={32} />
            <div className="upload-drop__title">
              Drop a file or click to browse
            </div>
            <div className="upload-drop__hint">
              Accepts <code>.pdf</code>, <code>.html</code>, <code>.csv</code>,{" "}
              <code>.json</code>
            </div>
          </div>
        )}
      </label>

      <SubmitButton />

      {state.status === "success" && (
        <div className="upload-alert upload-alert--ok">
          <div className="upload-alert__title">{state.message}</div>
          {state.topicSummary && state.topicSummary.length > 0 && (
            <div className="upload-alert__topics">
              {state.topicSummary.map((t, i) => (
                <span
                  key={i}
                  className={
                    "upload-topic-chip" + (t.created ? " upload-topic-chip--new" : "")
                  }
                >
                  {t.name} · {t.count}
                  {t.created && <span className="upload-topic-chip__new">new</span>}
                </span>
              ))}
            </div>
          )}
          {state.warnings && state.warnings.length > 0 && (
            <details>
              <summary>{state.warnings.length} warning(s)</summary>
              <ul>
                {state.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
      {state.status === "error" && (
        <div className="upload-alert upload-alert--err">
          {state.message}
          {state.warnings && state.warnings.length > 0 && (
            <ul>
              {state.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="admin-btn admin-btn--primary upload-submit"
    >
      {pending ? "Parsing & inserting…" : "Upload & insert"}
    </button>
  );
}
