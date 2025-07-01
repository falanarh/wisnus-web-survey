import React from 'react';

interface LoaderProps {
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false }) => {
  const loaderElement = (
    <div className="relative flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 border-4 border-t-blue-600 dark:border-t-blue-300 border-blue-200 dark:border-gray-800 rounded-full animate-spin shadow-lg"></div>
      <span className="text-blue-700 dark:text-blue-200 text-sm font-semibold tracking-wide animate-pulse mt-2">Sedang memuat...</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
};

export default Loader;