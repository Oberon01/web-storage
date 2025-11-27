# Cloudflare Pages Deployment Guide

## 🚨 Important: File Storage Limitation

**The local file storage system won't work on Cloudflare Pages.** You have two options:

### Option A: Keep File Storage Simple (Recommended for Start)
Use the hybrid approach - deploy to Cloudflare but keep a small VPS for file storage via API.

### Option B: Full Cloudflare (Requires Modifications)
Migrate to Cloudflare R2 for file storage and KV for metadata.

---

## 🎯 Quick Deploy to Cloudflare Pages (Hybrid Approach)

This keeps your current code working with minimal changes.

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Build for Cloudflare

```bash
npm run pages:build
```

### Step 4: Deploy to Cloudflare Pages

```bash
wrangler pages deploy .vercel/output/static --project-name=web-storage
```

### Step 5: Set Environment Variables

Go to Cloudflare Dashboard → Pages → your-project → Settings → Environment Variables

Add:
- `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NEXTAUTH_URL` (e.g., https://storage.yourdomain.com)

### Step 6: Configure Custom Domain

1. Go to Pages → your-project → Custom domains
2. Click "Set up a custom domain"
3. Enter your subdomain: `storage.yourdomain.com`
4. Cloudflare will automatically configure DNS

---

## 🔧 Setting Up Cloudflare R2 (Full Cloudflare Solution)

If you want everything on Cloudflare:

### 1. Create R2 Bucket

```bash
wrangler r2 bucket create web-storage-files
```

### 2. Create KV Namespace

```bash
wrangler kv:namespace create FILE_METADATA
```

Copy the ID and update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "FILE_METADATA"
id = "your-kv-namespace-id-here"
```

### 3. Update Code for R2/KV

You'll need to modify:
- `app/db.ts` - Use KV instead of files.json
- `app/actions.ts` - Use R2 for file uploads

**This requires significant code changes.** See below for modified files.

---

## 📁 Modified Files for R2/KV Storage

### Modified `app/db.ts` (for KV storage)

```typescript
import { StoredFile } from './types';

// This will be available in Cloudflare Workers context
declare const FILE_METADATA: KVNamespace;

export async function getAllFiles(): Promise<StoredFile[]> {
  try {
    const data = await FILE_METADATA.get('files', 'json');
    return data || [];
  } catch {
    return [];
  }
}

export async function addFile(file: StoredFile): Promise<void> {
  const files = await getAllFiles();
  files.push(file);
  await FILE_METADATA.put('files', JSON.stringify(files));
}

export async function deleteFile(id: string): Promise<void> {
  const files = await getAllFiles();
  const filtered = files.filter(f => f.id !== id);
  await FILE_METADATA.put('files', JSON.stringify(filtered));
}

export async function getFileById(id: string): Promise<StoredFile | null> {
  const files = await getAllFiles();
  return files.find(f => f.id === id) || null;
}
```

### Modified `app/actions.ts` (for R2 storage)

```typescript
'use server'

import { StoredFile } from './types';
import { getFileType, getFileCategory } from './utils';
import { addFile, deleteFile, getAllFiles, getFileById } from './db';

// This will be available in Cloudflare Workers context
declare const FILE_STORAGE: R2Bucket;

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload to R2
    await FILE_STORAGE.put(filename, bytes, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const fileType = getFileType(file.name);
    const category = getFileCategory(fileType);

    const storedFile: StoredFile = {
      id: Date.now().toString(),
      name: file.name,
      type: fileType,
      category,
      size: file.size,
      uploadDate: new Date().toISOString(),
      path: `/api/files/${filename}`, // We'll create an API route to serve files
    };

    await addFile(storedFile);

    return { success: true, file: storedFile };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

// ... rest of the file
```

---

## 🤔 Which Approach Should You Use?

### Use Hybrid Approach (Current Code) If:
- ✅ You want to deploy quickly
- ✅ You don't mind managing a small VPS for files
- ✅ You want to keep the current simple setup

### Use Full Cloudflare (R2/KV) If:
- ✅ You want everything on Cloudflare
- ✅ You're comfortable modifying the code
- ✅ You want true serverless

---

## 🚀 Recommended: Hybrid Deployment

1. **Deploy the Next.js app to Cloudflare Pages** (for your subdomain)
2. **Keep a cheap VPS** ($5/mo) for file storage with the Docker setup
3. **Configure CORS** to allow the Cloudflare app to access VPS files

This gives you:
- ✅ Fast global CDN from Cloudflare
- ✅ Custom subdomain on your domain
- ✅ Simple file storage that works
- ✅ Low cost

---

## 📝 Custom Domain Setup in Cloudflare

After deploying:

1. Go to Cloudflare Dashboard
2. Pages → Your Project → Custom domains
3. Click "Set up a custom domain"
4. Enter: `storage.yourdomain.com` (or whatever subdomain you want)
5. Cloudflare automatically:
   - Creates DNS record
   - Provisions SSL certificate
   - Routes traffic to your app

Done! Your app will be at `https://storage.yourdomain.com`

---

## 🔒 Security on Cloudflare

Don't forget to set these environment variables in Cloudflare Dashboard:

- `AUTH_SECRET` - Random string (required)
- `ADMIN_USERNAME` - Your username
- `ADMIN_PASSWORD` - Your password (use hash in production)
- `NEXTAUTH_URL` - Your full URL: https://storage.yourdomain.com

---

## 🆘 Troubleshooting

**Build fails?**
- Make sure you're using Next.js 15, not 16
- Run `npm run pages:build` locally first
- Check build output for errors

**Files not uploading?**
- This is expected with current code on Cloudflare
- Use hybrid approach or modify for R2

**Authentication not working?**
- Check environment variables are set
- Verify NEXTAUTH_URL matches your domain
- Check Cloudflare Pages logs

---

## 💡 Next Steps

1. Deploy with current code to see it working
2. Test with your custom subdomain
3. Decide if you want to modify for R2/KV storage
4. Or keep the hybrid approach with VPS for files
