'use client'

import { useState, useEffect } from 'react';
import { StoredFile, FileCategory } from './types';
import { getFiles, removeFile } from './actions';
import UploadZone from './components/UploadZone';
import FileCard from './components/FileCard';
import FileViewer from './components/FileViewer';
import { HardDrive, FolderOpen, Image, FileText, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Home() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [filter, setFilter] = useState<FileCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<StoredFile | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    const result = await getFiles();
    if (result.success) {
      setFiles(result.files);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const result = await removeFile(id);
      if (result.success) {
        setFiles(files.filter(f => f.id !== id));
      } else {
        alert('Failed to delete file');
      }
    }
  };

  const handleView = (file: StoredFile) => {
    setViewingFile(file);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut({ callbackUrl: '/login' });
    }
  };

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.category === filter;
  });

  const stats = {
    total: files.length,
    documents: files.filter(f => f.category === 'documents').length,
    media: files.filter(f => f.category === 'media').length,
    totalSize: files.reduce((acc, f) => acc + f.size, 0),
  };

  const formatTotalSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    const mb = bytes / (1024 * 1024);
    return gb > 1 ? `${gb.toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="w-10 h-10 text-blue-500" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Web Storage
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Store and manage your documents and media files
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.documents}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Media</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.media}</p>
              </div>
              <Image className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTotalSize(stats.totalSize)}
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <UploadZone onUploadComplete={loadFiles} />

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Files
          </button>
          <button
            onClick={() => setFilter('documents')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'documents'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setFilter('media')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'media'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Media
          </button>
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'No files yet. Upload some files to get started!' 
                : `No ${filter} files found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map(file => (
              <FileCard 
                key={file.id} 
                file={file} 
                onDelete={handleDelete} 
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <FileViewer 
          file={viewingFile} 
          onClose={() => setViewingFile(null)} 
        />
      )}
    </div>
  );
}
