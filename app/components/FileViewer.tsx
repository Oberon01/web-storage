'use client'

import { StoredFile } from '../types';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface FileViewerProps {
  file: StoredFile;
  onClose: () => void;
}

export default function FileViewer({ file, onClose }: FileViewerProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(file.type);
  const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(file.type);
  const isPDF = file.type === 'pdf';
  const isViewableDocument = ['pdf', 'txt'].includes(file.type);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate pr-4">
            {file.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isImage && (
            <div className="flex items-center justify-center h-full">
              <img
                src={file.path}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {isVideo && (
            <div className="flex items-center justify-center h-full">
              <video
                src={file.path}
                controls
                autoPlay
                className="max-w-full max-h-full"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {isPDF && (
            <div className="h-full min-h-[600px]">
              <iframe
                src={file.path}
                className="w-full h-full border-0 rounded"
                title={file.name}
              />
            </div>
          )}

          {file.type === 'txt' && (
            <div className="h-full">
              <iframe
                src={file.path}
                className="w-full h-full min-h-[600px] border-0 rounded bg-white dark:bg-gray-900"
                title={file.name}
              />
            </div>
          )}

          {!isImage && !isVideo && !isViewableDocument && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  File type: {file.type.toUpperCase()}
                </p>
                <a
                  href={file.path}
                  download={file.name}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Download to View
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
