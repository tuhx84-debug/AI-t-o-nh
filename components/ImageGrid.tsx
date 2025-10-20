
import React from 'react';
import { type GeneratedImage } from '../types';
import { DownloadIcon } from './icons';

interface ImageGridProps {
  images: GeneratedImage[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-lg">
          <img src={image.src} alt={`Generated portrait ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <a
              href={image.src}
              download={`chan-dung-viet-ai-${index + 1}.png`}
              className="flex items-center gap-2 bg-white text-stone-800 font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <DownloadIcon className="w-5 h-5"/>
              TẢI ẢNH VỀ
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
