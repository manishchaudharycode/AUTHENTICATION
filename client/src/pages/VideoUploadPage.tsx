import {VideoUpload} from "@/components/videoUploder/videoLoad"

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-balance">Video Uploader</h1>
        <p className="text-sm text-muted-foreground">
          This  stores videos in an in-memory server cache for preview purposes. For production, use a persistent
          storage service.
        </p>
      </header>
      <VideoUpload />
    </main>
  )
}
