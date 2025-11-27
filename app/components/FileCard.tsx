'use client'

import { StoredFile } from '../types';
import { formatFileSize, formatDate } from '../utils';
import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Video, 
  Download, 
  Trash2,
  File,
  Eye,
  Play
} from 'lucide-react';

interface FileCardProps {
  file: StoredFile;
  onDelete: (id: string) => void;
  onView: (file: StoredFile) => void;
}

export default function FileCard({ file, onDelete, onView }: FileCardProps) {
  const getIcon = () => {
    switch (file.type) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-12 h-12 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-12 h-12 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return <FileImage className="w-12 h-12 text-purple-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mkv':
      case 'webm':
        return <Video className="w-12 h-12 text-red-500" />;
      default:
        return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.type);
  const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(file.type);
  const isViewable = isImage || isVideo || ['pdf', 'txt'].includes(file.type);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getViewButtonContent = () => {
    if (isVideo) {
      return (
        <>
          <Play className="w-4 h-4" />
          Play
        </>
      );
    }
    return (
      <>
        <Eye className="w-4 h-4" />
        View
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Preview or Icon */}
        <div 
          className="flex items-center justify-center mb-4 h-32 bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => isViewable && onView(file)}
        >
          {isImage ? (
            <img 
              src={file.path} 
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : isVideo ? (
            <div className="relative w-full h-full">
              <video 
                src={file.path} 
                className="max-h-full max-w-full object-contain mx-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : (
            getIcon()
          )}
        </div>

        {/* File Info */}
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1" title={file.name}>
            {file.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {formatFileSize(file.size)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(file.uploadDate)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isViewable && (
            <button
              onClick={() => onView(file)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              {getViewButtonContent()}
            </button>
          )}
          <button
            onClick={handleDownload}
            className={`${isViewable ? 'flex-1' : 'flex-1'} flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors`}
          >
            <Download className="w-4 h-4" />
            {isViewable ? '' : 'Download'}
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
