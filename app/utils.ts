import { FileType, FileCategory } from './types';

export function getFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, FileType> = {
    // Documents
    pdf: 'pdf',
    doc: 'doc',
    docx: 'docx',
    xls: 'xls',
    xlsx: 'xlsx',
    ppt: 'ppt',
    pptx: 'pptx',
    txt: 'txt',
    dwg: 'dwg',
    dxf: 'dxf',
    // Media - Images
    jpg: 'jpg',
    jpeg: 'jpeg',
    png: 'png',
    gif: 'gif',
    webp: 'webp',
    svg: 'svg',
    // Media - Videos
    mp4: 'mp4',
    mov: 'mov',
    avi: 'avi',
    mkv: 'mkv',
    webm: 'webm',
  };
  
  return typeMap[ext] || 'other';
}

export function getFileCategory(fileType: FileType): FileCategory {
  const imageTypes: FileType[] = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoTypes: FileType[] = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  
  if (imageTypes.includes(fileType) || videoTypes.includes(fileType)) {
    return 'media';
  }
  
  return 'documents';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
