"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UploadResponse = {
  url: string;
  secureUrl: string;
  publicId: string;
  cloudinaryId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  folder = "uploads",
  required,
  className,
  includeMetadata = false,
  allowRemove = false,
  chooseLabel = "Choose image",
  replaceLabel = "Replace image",
  removeLabel = "Remove image",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  required?: boolean;
  className?: string;
  /** When true, adds hidden fields for media library metadata (publicId, cloudinaryId, etc.) */
  includeMetadata?: boolean;
  allowRemove?: boolean;
  chooseLabel?: string;
  replaceLabel?: string;
  removeLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<string | null>(null);
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState(defaultValue);
  const [metadata, setMetadata] = useState<UploadResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function uploadFile(file: File) {
    setError("");
    setUploading(true);
    setProgress(0);
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const blobUrl = URL.createObjectURL(file);
    blobRef.current = blobUrl;
    setPreview(blobUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText) as UploadResponse;
        setUrl(data.url);
        setPreview(data.url);
        setMetadata(data);
        setProgress(100);
        return;
      }

      let message = "Upload failed";
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // ignore
      }
      setError(message);
      setPreview(defaultValue);
      setUrl(defaultValue);
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("Upload failed");
      setPreview(defaultValue);
      setUrl(defaultValue);
    };

    xhr.send(formData);
  }

  function removeImage() {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    if (inputRef.current) inputRef.current.value = "";
    setUrl("");
    setPreview("");
    setMetadata(null);
    setError("");
    setProgress(0);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={`${name}-file`}>{label}</Label>
      <input type="hidden" name={name} value={url} required={required && !url} />
      {includeMetadata && metadata && (
        <>
          <input type="hidden" name="publicId" value={metadata.publicId} />
          <input type="hidden" name="cloudinaryId" value={metadata.cloudinaryId} />
          <input type="hidden" name="secureUrl" value={metadata.secureUrl} />
          <input type="hidden" name="format" value={metadata.format ?? ""} />
          <input type="hidden" name="width" value={metadata.width ?? ""} />
          <input type="hidden" name="height" value={metadata.height ?? ""} />
          <input type="hidden" name="bytes" value={metadata.bytes ?? ""} />
        </>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={`${name}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={allowRemove ? "sr-only" : "text-sm file:mr-3 file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
        {allowRemove && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="border border-foreground px-4 py-2 text-xs uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {preview ? replaceLabel : chooseLabel}
            </button>
            {preview && (
              <button
                type="button"
                data-image-action="remove"
                onClick={removeImage}
                disabled={uploading}
                className="px-2 py-2 text-xs uppercase tracking-wider text-red-700 transition-colors hover:text-red-900 disabled:opacity-50"
              >
                {removeLabel}
              </button>
            )}
          </>
        )}
        {uploading && (
          <span className="text-xs text-muted">Uploading… {progress}%</span>
        )}
      </div>
      {uploading && (
        <div className="h-1 w-full overflow-hidden bg-border">
          <div
            className="h-full bg-gold transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {preview && (
        <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden border border-border bg-background-secondary">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={preview.startsWith("blob:")}
          />
        </div>
      )}
      {url && !uploading && (
        <p className="break-all text-xs text-muted">{url}</p>
      )}
    </div>
  );
}
