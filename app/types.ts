export type FileCategory = 'documents' | 'media';

export type FileType = 
  // Documents
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'txt'
  | 'dwg'
  | 'dxf'
  | 'cad'
  // Media
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'gif'
  | 'webp'
  | 'svg'
  | 'mp4'
  | 'mov'
  | 'avi'
  | 'mkv'
  | 'webm'
  | 'other';

export interface StoredFile {
  id: string;
  name: string;
  type: FileType;
  category: FileCategory;
  size: number;
  uploadDate: string;
  path: string;
}
