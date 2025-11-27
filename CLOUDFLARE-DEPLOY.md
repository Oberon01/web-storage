# Deploy to Cloudflare Pages - Simple Guide

## 🎯 What You Need

1. Cloudflare account (free tier works)
2. Domain managed by Cloudflare
3. This application (already configured for Next.js 15)

## 📝 Important Note About File Storage

**Current Limitation:** The filesystem-based storage won't persist on Cloudflare Pages. 

**Two Solutions:**

### A. Quick Test Deploy (Files won't persist)
Deploy as-is to test authentication and UI on your subdomain. Files will work but reset on each deployment.

### B. Production Deploy with R2 Storage
Add Cloudflare R2 storage for persistent files (requires code modifications - see below).

---

## 🚀 Method 1: Deploy via GitHub (Easiest)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/web-storage.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your repository
6. Configure build:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Root directory:** (leave blank)

### Step 3: Set Environment Variables

In the build configuration, add:

```
AUTH_SECRET=your-generated-secret-here
ADMIN_USERNAME=youradmin
ADMIN_PASSWORD=yourpassword
NEXTAUTH_URL=https://storage.yourdomain.com
```

Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 4: Deploy

Click **Save and Deploy**

### Step 5: Add Custom Domain

1. After deployment, go to **Custom domains**
2. Click **Set up a domain**
3. Enter your subdomain: `storage.yourdomain.com`
4. Cloudflare will automatically configure DNS and SSL

✅ Done! Visit `https://storage.yourdomain.com`

---

## 🚀 Method 2: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login

```bash
wrangler login
```

### Step 3: Build the App

```bash
npm install
npm run build
```

### Step 4: Deploy

```bash
npx wrangler pages deploy .next --project-name=web-storage
```

### Step 5: Set Environment Variables

```bash
npx wrangler pages secret put AUTH_SECRET
npx wrangler pages secret put ADMIN_USERNAME  
npx wrangler pages secret put ADMIN_PASSWORD
npx wrangler pages secret put NEXTAUTH_URL
```

Or set them in Cloudflare Dashboard → Pages → Settings → Environment variables

### Step 6: Add Custom Domain

Go to Cloudflare Dashboard → Pages → Custom domains → Set up a domain

---

## 🗄️ Adding Persistent Storage with R2 (Optional)

If you want files to persist between deployments:

### Step 1: Create R2 Bucket

```bash
npx wrangler r2 bucket create web-storage-files
```

### Step 2: Create KV Namespace

```bash
npx wrangler kv:namespace create FILE_METADATA
```

This will output an ID like: `{ binding = "FILE_METADATA", id = "xxxxx" }`

### Step 3: Update wrangler.toml

Edit `wrangler.toml` with your IDs:

```toml
name = "web-storage"
compatibility_date = "2024-11-27"
pages_build_output_dir = ".next"

[[kv_namespaces]]
binding = "FILE_METADATA"
id = "your-kv-id-from-step-2"

[[r2_buckets]]
binding = "FILE_STORAGE"
bucket_name = "web-storage-files"
```

### Step 4: Bind to Pages Project

```bash
npx wrangler pages project create web-storage
npx wrangler pages deployment create
```

Or bind in Cloudflare Dashboard:
- Pages → Settings → Functions
- Add KV namespace binding: FILE_METADATA
- Add R2 bucket binding: FILE_STORAGE

### Step 5: Code Modifications Needed

You'll need to modify these files to use R2/KV:
- `app/db.ts` - Replace file-based DB with KV
- `app/actions.ts` - Replace filesystem with R2
- Add `app/api/files/[filename]/route.ts` - Serve files from R2

**I can provide these modifications if you want to use R2 storage.**

---

## 🎨 Custom Subdomain Configuration

### If Your Domain is Already on Cloudflare:

1. Go to Pages → Your Project → Custom domains
2. Click "Set up a custom domain"
3. Enter: `storage.yourdomain.com`
4. Cloudflare will:
   - Create DNS CNAME record automatically
   - Provision SSL certificate automatically
   - Route traffic to your Pages deployment

### If Your Domain is NOT on Cloudflare:

You'll need to either:
- Transfer DNS to Cloudflare (recommended)
- Or manually create a CNAME record pointing to: `your-project.pages.dev`

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Changed default credentials in environment variables
- [ ] Generated secure AUTH_SECRET
- [ ] Set NEXTAUTH_URL to your subdomain
- [ ] Tested locally with `npm run dev`
- [ ] Committed code to Git (if using GitHub method)
- [ ] Decided on file storage approach (temporary vs R2)

---

## 🔍 Testing Your Deployment

After deployment:

1. Visit your subdomain: `https://storage.yourdomain.com`
2. You should be redirected to login
3. Login with your credentials
4. Try uploading a file
5. **Note:** Without R2, files will disappear on next deployment

---

## 📊 Cost Estimate

- **Cloudflare Pages:** Free for up to 500 builds/month
- **Custom Domain:** Free (if domain on Cloudflare)
- **SSL Certificate:** Free (automatic)
- **R2 Storage** (optional):
  - Free tier: 10GB storage, 1 million reads/month
  - After free tier: $0.015/GB/month

---

## 🆘 Troubleshooting

**Build Failed:**
- Check Next.js version is 15.x (not 16.x)
- Verify all dependencies installed
- Check build logs in Cloudflare dashboard

**Login Not Working:**
- Verify environment variables are set
- Check NEXTAUTH_URL matches your domain exactly
- Make sure it includes https://

**Custom Domain Not Working:**
- Wait 5-10 minutes for DNS propagation
- Check DNS settings in Cloudflare
- Verify domain is on Cloudflare nameservers

**Files Disappearing:**
- This is normal without R2
- Files are stored in temporary filesystem
- Implement R2 storage for persistence

---

## 🎉 You're Done!

Your web storage app should now be live at:
`https://storage.yourdomain.com`

Need help with R2 integration? Let me know!
