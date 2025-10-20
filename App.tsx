
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGrid } from './components/ImageGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FlowerIcon } from './components/icons';
import { TOPICS, ASPECT_RATIOS } from './constants';
import { type GeneratedImage } from './types';
import { generatePortraits } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [context, setContext] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIOS[0]);
  const [numImages, setNumImages] = useState<number>(4);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedFile) {
      setError('Cần ảnh khuôn mặt để tạo ảnh chính xác.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const images = await generatePortraits({
        imageFile: uploadedFile,
        topic,
        context,
        aspectRatio,
        numImages,
      });
      setGeneratedImages(images.map((src, index) => ({ id: `${Date.now()}-${index}`, src })));
    } catch (err) {
      console.error(err);
      setError('Đã có lỗi xảy ra trong quá trình tạo ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, topic, context, aspectRatio, numImages]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#5D4037] p-4 sm:p-8">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 text-2xl sm:text-3xl font-bold text-pink-500">
          <FlowerIcon className="w-8 h-8"/>
          <h1>Tôn vinh vẻ đẹp phụ nữ Việt</h1>
        </div>
        <p className="text-stone-500 mt-2">Tạo ảnh chân dung nghệ thuật với AI, giữ trọn vẹn nét đẹp tự nhiên của bạn.</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-white rounded-2xl shadow-lg border border-pink-100">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-stone-700 mb-4">1. Tải lên ảnh chân dung của bạn</h2>
            <ImageUploader onImageUpload={setUploadedFile} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-700">2. Lựa chọn phong cách</h2>
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-stone-600 mb-1">Chủ đề</label>
              <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-3 border border-pink-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition">
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-stone-600 mb-1">Mô tả bối cảnh (tùy chọn)</label>
              <textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="VD: buổi chiều tà, ánh nắng vàng ấm áp, cảm xúc vui tươi..." className="w-full p-3 border border-pink-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="aspect_ratio" className="block text-sm font-medium text-stone-600 mb-1">Tỷ lệ khung hình</label>
                <select id="aspect_ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3 border border-pink-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition">
                  {ASPECT_RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="num_images" className="block text-sm font-medium text-stone-600 mb-1">Số lượng ảnh</label>
                <input id="num_images" type="number" value={numImages} onChange={(e) => setNumImages(Math.max(1, Math.min(8, parseInt(e.target.value, 10))))} min="1" max="8" className="w-full p-3 border border-pink-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center my-8">
          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="px-12 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-pink-400 to-amber-300 hover:from-pink-500 hover:to-amber-400 shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Đang tạo ảnh...' : 'TẠO ẢNH'}
          </button>
        </div>

        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        {isLoading && <LoadingSpinner />}

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-stone-700">Kết quả của bạn</h2>
            <ImageGrid images={generatedImages} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
