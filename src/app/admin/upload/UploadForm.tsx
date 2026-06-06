"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { IconCloudUpload, IconFile, IconX } from "@tabler/icons-react";
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

  const filteredTopics = topics.filter((t) => t.subjectId === subjectId);

  return (
    <form action={formAction} className="upload-form">
      <div className="upload-form__row">
        <label className="upload-field">
          <span className="upload-field__label">Subject</span>
          <select
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
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
        <label className="upload-field">
          <span className="upload-field__label">Topic</span>
          <select
            name="topicId"
            className="upload-field__input"
            required
            disabled={!subjectId}
          >
            <option value="">
              {subjectId ? "Choose a topic…" : "Pick a subject first"}
            </option>
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
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
          {state.message}
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
