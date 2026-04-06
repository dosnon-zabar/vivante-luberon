"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Props = {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  fallbackText,
}: Props) {
  const [status, setStatus] = useState<"pending" | "loaded" | "error">(
    "pending"
  );

  // Probe the image URL before rendering <Image> to avoid layout issues
  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    const img = new window.Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    img.src = src;
  }, [src]);

  if (status !== "loaded") {
    return (
      <div
        className={`flex items-center justify-center bg-vert-eau/15 ${
          fill ? "absolute inset-0" : ""
        } ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-vert-eau/70 font-serif text-sm text-center px-4 leading-tight">
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
    />
  );
}
