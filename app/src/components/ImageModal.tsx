import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (dataUrl: string) => void;
  imageUrl?: string;
}

const ImageModal = ({
  isOpen,
  onClose,
  onImageSelect,
  imageUrl,
}: ImageModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && onImageSelect) {
        onImageSelect(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (!isOpen) return null;

  if (imageUrl) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 z-50 cursor-pointer"
        >
          <X size={20} />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-full rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Wrapper for positioning */}
      <div className="relative w-full max-w-xl">
        {/* Close Button - Now outside the dropzone's hover group scope */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-12 right-0 md:-right-12 md:top-0 p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 z-50 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* The Dropzone - acts as the 'group' for hover effects inside it */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            group relative w-full h-80 md:h-96
            rounded-3xl border-2 border-dashed
            flex flex-col items-center justify-center text-center
            cursor-pointer overflow-hidden
            transition-all duration-300 ease-out
            ${
              isDragging
                ? "bg-indigo-500/10 border-indigo-400 scale-[1.02]"
                : "bg-[#0A0514] border-white/10 hover:border-indigo-500/30 hover:bg-[#0f0a1a]"
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/png, image/jpeg, image/gif, image/webp"
          />

          {/* Background Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

          {/* Icon & Text */}
          <div className="relative z-10 flex flex-col items-center space-y-6 -mt-8 transition-transform duration-300 group-hover:-translate-y-2">
            <div
              className={`
              p-5 rounded-3xl bg-[#1A1625] text-indigo-400 shadow-2xl
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:text-indigo-300
              ${isDragging ? "scale-110 rotate-3 text-indigo-300" : ""}
            `}
            >
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>

            <div className="space-y-2 px-4">
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Upload Image
              </h3>
              <p className="text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed">
                Drag and drop your file here, or click to browse
              </p>
            </div>
          </div>

          {/* Floating Action Button - Matching ChatRoomCard Style */}
          <div className="absolute bottom-8 z-10">
            <button
              type="button"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`
                px-8 py-3 rounded-full 
                bg-[#060010] border-2 
                text-sm font-medium tracking-wide
                flex items-center gap-2 cursor-pointer
                transition-all duration-300 ease-out
                ${
                  isButtonHovered
                    ? "border-indigo-500/50 text-indigo-100 shadow-lg shadow-indigo-500/10 -translate-y-0.5"
                    : "border-white/10 text-slate-400 shadow-none"
                }
              `}
            >
              <span>Select File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;