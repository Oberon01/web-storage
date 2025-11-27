import { StoredFile } from './types';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'files.json');

export async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
  }
}

export async function getAllFiles(): Promise<StoredFile[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function addFile(file: StoredFile): Promise<void> {
  const files = await getAllFiles();
  files.push(file);
  await fs.writeFile(DB_PATH, JSON.stringify(files, null, 2));
}

export async function deleteFile(id: string): Promise<void> {
  const files = await getAllFiles();
  const filtered = files.filter(f => f.id !== id);
  await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}

export async function getFileById(id: string): Promise<StoredFile | null> {
  const files = await getAllFiles();
  return files.find(f => f.id === id) || null;
}
