
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       if(fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
       }
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="w-full max-w-sm h-64 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center text-center p-4 cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {preview ? (
        <img src={preview} alt="Xem trước" className="max-w-full max-h-full rounded-lg object-contain" />
      ) : (
        <div className="text-stone-500">
          <UploadIcon className="w-12 h-12 mx-auto text-pink-400"/>
          <p className="mt-2 font-semibold">Nhấn để tải lên hoặc kéo thả</p>
          <p className="text-xs mt-1">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};
