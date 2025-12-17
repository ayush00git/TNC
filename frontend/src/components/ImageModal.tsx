import React, { useEffect, useRef } from 'react';
import { X, Image, UploadCloud } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (dataUrl: string) => void;
}

const ImageModal = ({ isOpen, onClose, onImageSelect }: ImageModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0A0514] border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-in-95 animate-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0514]">
          <div className="flex items-center gap-3">
            <Image size={18} className="text-indigo-400" />
            <h3 className="text-white font-semibold tracking-wide">Upload Image</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <div 
              onClick={handleUploadClick}
              className="w-full h-64 bg-[#060010] border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-white/5 transition-colors"
            >
                <UploadCloud size={48} className="mb-4 text-slate-500" />
                <p className="font-semibold">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-[#080412] flex justify-end">
          <button 
            onClick={handleUploadClick}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
