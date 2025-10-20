
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-400"></div>
      <p className="mt-4 text-stone-600 font-semibold">AI đang sáng tạo, vui lòng chờ trong giây lát...</p>
    </div>
  );
};
