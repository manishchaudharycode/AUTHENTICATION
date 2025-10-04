"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios, { type AxiosProgressEvent } from "axios";
import { API_URL } from "@/config/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [videoLocalPreviewUrl, setVideoLocalPreviewUrl] = useState<
    string | null
  >(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState("")

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChooseFile = useCallback((f: File | null) => {
    setError(null);
    setProgress(0);
    setFile(null);
    setVideoUrl(null); // reset uploaded URL if re-choosing

    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Only video files are allowed.");
      return;
    }
    const MAX_BYTES = 100 * 1024 * 1024;
    if (f.size > MAX_BYTES) {
      setError("File too large. Max 100 MB.");
      return;
    }
    setFile(f);
  }, []);

  const handleVideoUpload = useCallback(async () => {
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append("upload_preset", "ml_default"); // adjust if needed
      fd.append("file", file);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqkfccfp/upload",
        fd,
        {
          onUploadProgress: (p: AxiosProgressEvent) => {
            if (!p.total) return;
            const percentCompleted = Math.round((p.loaded * 100) / p.total);
            setProgress(percentCompleted);
          },
        }
      );

      setVideoUrl(res.data.secure_url as string);
      setStreamUrl(res.data.playback_url as string)
      // when Cloudinary provides duration (in seconds), use it to pre-fill
      if (typeof res.data.duration === "number") {
        setDuration(Math.round(res.data.duration));
      }
    } catch (e: unknown) {
      setError("Video upload failed. Please try again.");
      console.log(e);
    } finally {
      setUploading(false);
    }
  }, [file]);

  const handlePublish = useCallback(async () => {
    if (!videoUrl) {
      setError("Please upload the video first to get its URL.");
      return;
    }
    setError(null);

    try {
      const publishFD = new FormData();
      publishFD.append("title", title);
      publishFD.append("description", description);
      if (typeof duration === "number") {
        publishFD.append("duration", String(duration));
      }
      publishFD.append("videoUrl", videoUrl);
      publishFD.append("streamUrl",streamUrl)
      publishFD.append("isPublished", String(isPublished));
      if (thumbnailFile) {
        publishFD.append("thumbnail", thumbnailFile);
      }

      const res = await axios.post(`${API_URL}/video`, publishFD, {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQyODZiNGFkZDEwYmU3YTc5NjBjMzIiLCJ1c2VybmFtZSI6Im1hbmlzaDEyMyIsImVtYWlsIjoibWFuaXNoY2hhdWRoYXJ5MDUwMjE5OTZAZ21haWwuY29tIiwiZnVsbE5hbWUiOiJtYW5pc2ggY2hhdWRoYXJ5IiwiaWF0IjoxNzU5NDE4NTg2LCJleHAiOjE3NTk1MDQ5ODZ9.BdE8fXcdyqENeAaCiVOv40OTokmQTGhlUL2UKQLMqiQ",
        },
      });

      if (res.status !== 201) {
        throw new Error("Publish failed");
      }
    } catch (e) {
      setError("Publish request failed. Please verify the data and try again.");
      console.log(e);
    }
  }, [description, duration, isPublished, thumbnailFile, title, videoUrl]);

  const canUpload = useMemo(() => !!file && !uploading, [file, uploading]);

  useEffect(() => {
    if (!file) {
      setVideoLocalPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoLocalPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-pretty">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full rounded-md border overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {/* If a thumbnail is selected, show it; clicking swaps to video if video exists */}
                {thumbPreviewUrl ? (
                  <button
                    type="button"
                    className="w-full h-full"
                    aria-label="Play preview"
                    onClick={() => {
                      // if we have an uploaded video URL, show video on click
                      const hasVideo = Boolean(
                        videoUrl || videoLocalPreviewUrl
                      );
                      if (!hasVideo) return;
                      // toggle by clearing thumb preview (video element will render below)
                      setThumbPreviewUrl((prev) => (prev ? null : prev));
                    }}
                  >
                    <img
                      src={thumbPreviewUrl || "/placeholder.svg"}
                      alt={title ? `${title} thumbnail` : "Video thumbnail"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ) : null}

                {/* Show video if we have a local preview or uploaded URL */}
                {!thumbPreviewUrl && (videoLocalPreviewUrl || videoUrl) ? (
                  <video
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    src={videoUrl || undefined}
                    controls
                    preload="metadata"
                  >
                    {videoLocalPreviewUrl ? (
                      <source src={videoLocalPreviewUrl} />
                    ) : null}
                  </video>
                ) : null}

                {/* Fallback box if no media chosen */}
                {!thumbPreviewUrl && !videoLocalPreviewUrl && !videoUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    {"Select a thumbnail and/or video to preview"}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Details like a YouTube card */}
            <div className="space-y-1">
              <div className="text-base font-medium text-pretty">
                {title || "Untitled video"}
              </div>
              <div className="text-sm text-muted-foreground">
                {typeof duration === "number" && duration > 0
                  ? `${duration}s`
                  : "Duration not set"}
              </div>
              <div className="text-sm text-muted-foreground text-pretty">
                {description || "No description yet."}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form side */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-pretty">Upload & Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="video-input">
                Video file
              </label>

              <input
                ref={inputRef}
                id="video-input"
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
                onDrop={(e) => {
                  const f = e.dataTransfer.files?.[0];
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOver(false);
                  onChooseFile(f || null);
                }}
                className={[
                  "flex flex-col items-center justify-center gap-2",
                  "rounded-md border border-dashed p-8 text-center cursor-pointer",
                  dragOver ? "bg-muted/50" : "bg-card",
                ].join(" ")}
                onClick={() => inputRef.current?.click()}
                aria-label="Choose video file"
              >
                <div className="text-sm text-muted-foreground">
                  {"Drag and drop your video here, or click to select"}
                </div>
                {file ? (
                  <div className="text-sm">
                    Selected: <span className="font-medium">{file.name}</span>
                  </div>
                ) : null}
              </label>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="rounded-md border bg-background px-3 py-2 text-sm"
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="rounded-md border bg-background px-3 py-2 text-sm min-h-24"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Removed VIEWS field per request */}

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="duration">
                Duration (seconds)
              </label>
              <input
                id="duration"
                className="rounded-md border bg-background px-3 py-2 text-sm"
                type="number"
                min={0}
                placeholder="Enter duration (seconds)"
                value={typeof duration === "number" ? duration : ""}
                onChange={(e) =>
                  setDuration(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="thumbnail-input">
                Thumbnail (image file)
              </label>
              <input
                ref={thumbInputRef}
                id="thumbnail-input"
                type="file"
                accept="image/*"
                className="rounded-md border bg-background px-3 py-2 text-sm file:mr-3 file:py-2 file:px-3 file:rounded file:border file:bg-secondary file:text-foreground"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setThumbnailFile(f);
                }}
              />
              {thumbPreviewUrl ? (
                <div className="mt-1 text-xs text-muted-foreground">
                  {"Thumbnail selected"}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPublished"
                className="h-4 w-4 border border-accent"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <label htmlFor="isPublished" className="text-sm">
                Is Published
              </label>
            </div>

            {error ? (
              <div
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            {/* Actions: Upload video first to get URL, then Publish */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
              >
                Choose video
              </Button>
              <Button
                type="button"
                onClick={handleVideoUpload}
                disabled={!canUpload}
              >
                {uploading
                  ? "Uploading..."
                  : videoUrl
                  ? "Re-upload Video"
                  : "Upload Video"}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handlePublish}
                disabled={!videoUrl}
              >
                Publish
              </Button>
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

            {videoUrl ? (
              <div className="text-xs text-muted-foreground">
                {
                  "Video uploaded successfully. URL will be included in publish."
                }
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VideoUpload;
