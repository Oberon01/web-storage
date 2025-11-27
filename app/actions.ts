'use server'

import { promises as fs } from 'fs';
import path from 'path';
import { StoredFile } from './types';
import { getFileType, getFileCategory } from './utils';
import { addFile, deleteFile, getAllFiles, getFileById } from './db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadFile(formData: FormData) {
  try {
    await ensureUploadDir();
    
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    await fs.writeFile(filepath, buffer);

    const fileType = getFileType(file.name);
    const category = getFileCategory(fileType);

    const storedFile: StoredFile = {
      id: Date.now().toString(),
      name: file.name,
      type: fileType,
      category,
      size: file.size,
      uploadDate: new Date().toISOString(),
      path: `/uploads/${filename}`,
    };

    await addFile(storedFile);

    return { success: true, file: storedFile };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function getFiles() {
  try {
    const files = await getAllFiles();
    return { success: true, files };
  } catch (error) {
    console.error('Get files error:', error);
    return { success: false, error: 'Failed to get files', files: [] };
  }
}

export async function removeFile(id: string) {
  try {
    const file = await getFileById(id);
    if (!file) {
      return { success: false, error: 'File not found' };
    }

    const filepath = path.join(process.cwd(), 'public', file.path);
    
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    await deleteFile(id);

    return { success: true };
  } catch (error) {
    console.error('Remove file error:', error);
    return { success: false, error: 'Failed to remove file' };
  }
}
