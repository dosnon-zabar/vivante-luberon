"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { useToast } from "@/components/ToastProvider";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type Props = {
  prefix: "recettes" | "events" | "equipe";
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
};

type UploadingFile = {
  name: string;
  status: "uploading" | "success" | "error";
  url?: string;
  error?: string;
};

async function uploadOne(
  file: File,
  prefix: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prefix", prefix);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export default function ImageDropzone({
  prefix,
  onUploaded,
  multiple = false,
  label = "Glissez une image ici ou cliquez pour sélectionner",
  hint = `JPG, PNG, WebP — max ${MAX_FILE_SIZE_MB} Mo`,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const allFiles = Array.from(files);
    const oversized = allFiles.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    const filesArray = allFiles.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

    if (oversized.length > 0) {
      const names = oversized.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} Mo)`).join(", ");
      show(
        `Fichier${oversized.length > 1 ? "s" : ""} trop volumineux (max ${MAX_FILE_SIZE_MB} Mo) : ${names}`,
        "error"
      );
    }

    if (filesArray.length === 0) return;
    const initialUploads: UploadingFile[] = filesArray.map((f) => ({
      name: f.name,
      status: "uploading",
    }));
    setUploads((prev) => [...prev, ...initialUploads]);

    const startIdx = uploads.length;
    const successUrls: string[] = [];

    // Upload en parallèle
    const results = await Promise.all(filesArray.map((f) => uploadOne(f, prefix)));

    setUploads((prev) => {
      const next = [...prev];
      results.forEach((result, i) => {
        const idx = startIdx + i;
        if (result.success && result.url) {
          next[idx] = { name: filesArray[i].name, status: "success", url: result.url };
          successUrls.push(result.url);
        } else {
          next[idx] = {
            name: filesArray[i].name,
            status: "error",
            error: result.error || "Erreur",
          };
        }
      });
      return next;
    });

    if (successUrls.length > 0) {
      onUploaded(successUrls);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  }

  function clearUploads() {
    setUploads([]);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-orange bg-orange/5"
            : "border-brun/20 hover:border-orange/50 hover:bg-creme/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <svg
          className="w-8 h-8 mx-auto text-brun-light/50 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-sm text-brun font-medium">{label}</p>
        <p className="text-xs text-brun-light/60 mt-1">{hint}</p>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brun-light font-medium">
              {uploads.length} fichier{uploads.length > 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={clearUploads}
              className="text-xs text-brun-light/60 hover:text-brun-light"
            >
              Effacer
            </button>
          </div>
          <ul className="space-y-1">
            {uploads.map((u, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-creme/50"
              >
                {u.status === "uploading" && (
                  <svg className="w-4 h-4 text-orange animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {u.status === "success" && (
                  <svg className="w-4 h-4 text-vert-eau" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {u.status === "error" && (
                  <svg className="w-4 h-4 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="flex-1 truncate text-brun">{u.name}</span>
                {u.status === "error" && u.error && (
                  <span className="text-rose text-[10px]">{u.error}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
