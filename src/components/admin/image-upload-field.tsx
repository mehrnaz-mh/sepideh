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
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  required?: boolean;
  className?: string;
  /** When true, adds hidden fields for media library metadata (publicId, cloudinaryId, etc.) */
  includeMetadata?: boolean;
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
          className="text-sm file:mr-3 file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
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
