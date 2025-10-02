"use client";

import type { DragEvent } from "react";
import { useCallback, useMemo, useRef, useState, useId } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

type UploadedMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: number;
};

const MAX_BYTES = 100 * 1024 * 1024; // keep in sync with API
const formatBytes = (b: number) => {
  if (b === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${Number.parseFloat((b / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export function VideoUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedMeta | null>(null);

  const titleId = useId();
  const videoFileId = useId();
  const durationId = useId();
  const descriptionId = useId();
  const viewsId = useId();
  const thumbnailId = useId();
  const isPublishedId = useId();

  const onChooseFile = useCallback((f: File | null) => {
    setError(null);
    setUploaded(null);
    setProgress(0);
    setFile(null);

    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Only video files are allowed.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`File too large. Max ${formatBytes(MAX_BYTES)}.`);
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      onChooseFile(f || null);
    },
    [onChooseFile]
  );

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post("/api/videos", form, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        },
        // axios sets multipart/form-data headers for FormData automatically
      });
      setUploaded(res.data as UploadedMeta);
    } catch (e: any) {
      console.log();
      
      setError(e?.response?.data?.error ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }, [file]);

  const handleDelete = useCallback(async () => {
    if (!uploaded) return;
    try {
      await axios.delete(`/api/videos/${uploaded.id}`);
      setUploaded(null);
      setFile(null);
      setProgress(0);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Delete failed.");
    }
  }, [uploaded]);

  const canUpload = useMemo(() => !!file && !uploading, [file, uploading]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-lg border bg-card text-foreground">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-balance">Upload a video</h2>
          <p className="text-sm text-muted-foreground">
            Supported: any video/* type. Maximum size {formatBytes(MAX_BYTES)}.
          </p>
        </div>
        <div className="grid gap-2">
          <label htmlFor={titleId}>Title</label>
          <input
            id={titleId}
            className="p-1.5  border border-accent"
            type="text"
            placeholder="Enter title"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={durationId}>Duration</label>
          <input
            id={durationId}
            className="p-1.5 border border-accent"
            type="number"
            min={0}
            placeholder="Enter duration (seconds)"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={descriptionId}>Description</label>
          <input
            id={descriptionId}
            className="p-1.5 border border-accent"
            type="text"
            placeholder="Enter description"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={viewsId}>Views</label>
          <input
            id={viewsId}
            className="p-1.5  border border-accent"
            type="number"
            min={0}
            placeholder="Enter views"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={thumbnailId}>Thumbnail</label>
          <input
            id={thumbnailId}
            className="p-1.5  border border-accent"
            type="text"
            placeholder="Enter thumbnail URL"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={isPublishedId}>Is Published</label>
          <input
            id={isPublishedId}
            className="h-4 w-4 border border-accent"
            type="checkbox"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={videoFileId}>Video File</label>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => onChooseFile(e.target.files?.[0] || null)}
          />

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={[
              "flex flex-col items-center justify-center gap-2",
              "rounded-md border border-dashed p-8 text-center cursor-pointer",
              dragOver ? "bg-muted/50" : "bg-card",
            ].join(" ")}
            onClick={() => inputRef.current?.click()}
            aria-label="Upload video"
          >
            <div className="text-sm text-muted-foreground">
              Drag and drop your video here, or click to select
            </div>
            {file ? (
              <div className="text-sm">
                Selected: <span className="font-medium">{file.name}</span>{" "}
                <span className="text-muted-foreground">
                  ({formatBytes(file.size)})
                </span>
              </div>
            ) : null}
          </label>

          {error ? (
            <div
              className="text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              variant="secondary"
            >
              Choose file
            </Button>
            <Button type="button" onClick={handleUpload} disabled={!canUpload}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        {uploading ? (
          <div className="w-full">
            <div className="h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded bg-primary"
                style={{ width: `${progress}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                role="progressbar"
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {progress}%
            </div>
          </div>
        ) : null}

        {uploaded ? (
          <div className="space-y-3">
            <div className="text-sm">
              Uploaded: <span className="font-medium">{uploaded.name}</span>{" "}
              <span className="text-muted-foreground">
                ({formatBytes(uploaded.size)})
              </span>
            </div>

            <video
              className="w-full rounded-md border"
              src={uploaded.url}
              controls
              preload="metadata"
            />

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={uploaded.url}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                aria-label="Video URL"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(uploaded.url);
                  } catch {
                    /* ignore */
                  }
                }}
              >
                Copy URL
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VideoUpload;
