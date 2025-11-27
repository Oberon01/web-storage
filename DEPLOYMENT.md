# Deployment Guide

## ⚠️ Important Note About Cloudflare Pages

**Cloudflare Pages is NOT recommended for this application** because:

1. ❌ Next.js 16 is not yet supported by `@cloudflare/next-on-pages`
2. ❌ File uploads need persistent storage (Cloudflare Pages is stateless)
3. ❌ The file storage system requires a writable filesystem
4. ❌ Database (files.json) needs persistent storage

## ✅ Recommended Deployment Options

### Option 1: Vercel (Easiest - Made by Next.js team)

**Best for:** Easy deployment, automatic HTTPS, great for Next.js

#### Setup:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set Environment Variables in Vercel Dashboard:
   - Go to your project settings
   - Add Environment Variables:
     - `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD`
     - `NEXTAUTH_URL` (your Vercel domain)

4. Redeploy:
```bash
vercel --prod
```

**Note:** For file persistence, you'll need to use Vercel Blob Storage:
- https://vercel.com/docs/storage/vercel-blob

---

### Option 2: Docker + VPS (Most Control)

**Best for:** Full control, any hosting provider (DigitalOcean, AWS, etc.)

#### Dockerfile:

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

#### Deploy to VPS:

```bash
# Build image
docker build -t web-storage .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  -e AUTH_SECRET="your-secret" \
  -e ADMIN_USERNAME="admin" \
  -e ADMIN_PASSWORD="yourpassword" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  --name web-storage \
  web-storage
```

#### Use with nginx reverse proxy:

`/etc/nginx/sites-available/web-storage`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then get SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

### Option 3: Railway (Easy Docker Deployment)

**Best for:** Simple deployment with Docker, automatic HTTPS

1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub or local directory
4. Add environment variables in Railway dashboard
5. Railway will auto-detect and deploy

---

### Option 4: DigitalOcean App Platform

**Best for:** Managed deployment, automatic scaling

1. Go to DigitalOcean App Platform
2. Connect your repository
3. Configure environment variables
4. Deploy

---

### Option 5: Traditional VPS (No Docker)

**Best for:** Simple setup, full control

#### On Ubuntu/Debian:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone/upload your app
cd /var/www/web-storage

# Install dependencies
npm install

# Build
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Create .env.local with your credentials
nano .env.local

# Start with PM2
pm2 start npm --name "web-storage" -- start

# Make it run on startup
pm2 startup
pm2 save
```

Setup nginx as reverse proxy (same as Docker option above).

---

## 🔧 Converting for Cloudflare Pages (Advanced)

If you really want to use Cloudflare Pages, you'll need to:

1. **Downgrade Next.js** to version 15 or earlier
2. **Use Cloudflare D1** for database instead of files.json
3. **Use Cloudflare R2** for file storage instead of local filesystem
4. **Modify the entire app** to use Cloudflare's services

This requires significant code changes. Here's what you'd need to do:

```bash
# Downgrade Next.js
npm install next@15.0.0 --save

# Install Cloudflare adapter
npm install @cloudflare/next-on-pages --save-dev

# Modify package.json build script
"build": "next-on-pages"
```

Then you'd need to:
- Replace `app/db.ts` to use Cloudflare D1
- Replace file uploads to use Cloudflare R2
- Update all file operations
- Configure `wrangler.toml`

**This is NOT recommended** - use one of the other options instead.

---

## 📊 Comparison

| Platform | Difficulty | Cost | File Storage | Best For |
|----------|-----------|------|--------------|----------|
| Vercel | ⭐ Easy | Free tier available | Blob Storage addon | Quick deployment |
| Docker VPS | ⭐⭐ Medium | $5-20/mo | Built-in | Full control |
| Railway | ⭐ Easy | Free tier available | Built-in | Easy Docker |
| DigitalOcean | ⭐⭐ Medium | $12/mo+ | Built-in | Managed apps |
| Cloudflare Pages | ⭐⭐⭐⭐ Hard | Free tier available | Requires R2 | NOT recommended |

---

## 🎯 Recommended Approach

**For beginners:** Use Vercel or Railway

**For production:** Use Docker on VPS (DigitalOcean, AWS, etc.)

**For budget:** Railway free tier or cheap VPS ($5/mo)

---

## 🔒 Security Reminder

No matter which platform you choose:

1. ✅ Change default credentials
2. ✅ Use environment variables for secrets
3. ✅ Enable HTTPS/SSL
4. ✅ Set up backups for your files
5. ✅ Use strong passwords
6. ✅ Consider adding rate limiting

See [SECURITY.md](SECURITY.md) for more details.
