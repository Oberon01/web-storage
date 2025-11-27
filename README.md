# Web Storage Application

A modern, **secure** web storage application built with Next.js 15 that allows you to store, manage, and download documents and media files with password protection.

**✅ Cloudflare Pages Compatible** - Deploy to your custom subdomain!

## 🔒 Security Features

- **🔐 Password Protected**: Login required to access files
- **👤 User Authentication**: Secure credential verification with NextAuth
- **🛡️ Protected Routes**: All pages require authentication
- **🔑 Session Management**: Automatic logout support
- **🚫 No Public Access**: Files only accessible to authenticated users

**⚠️ IMPORTANT**: Change default credentials before deploying! See [SECURITY.md](SECURITY.md) for details.

## Features

- 📁 **Document Storage**: Support for PDF, Word, Excel, PowerPoint, CAD drawings (DWG, DXF), and text files
- 🎨 **Media Storage**: Support for images (JPG, PNG, GIF, WebP, SVG) and videos (MP4, MOV, AVI, MKV, WebM)
- ⬆️ **Easy Upload**: Drag-and-drop or click to upload files
- ⬇️ **Download**: Download any file to your device
- 🗂️ **Organization**: Filter files by category (All, Documents, Media)
- 📊 **Statistics**: View total files, storage used, and file counts by category
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- 🗑️ **File Management**: Delete files you no longer need

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: File system with JSON database

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Configure Security** (CRITICAL):
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and change these:
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - ADMIN_USERNAME (change from 'admin')
# - ADMIN_PASSWORD (change from 'changeme123')
```

See [SECURITY.md](SECURITY.md) for detailed security setup instructions.

3. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### First Time Login

1. Navigate to http://localhost:3000
2. You'll be redirected to the login page
3. Enter credentials (default: admin / changeme123)
4. **⚠️ IMMEDIATELY change these credentials in .env.local**

### Managing Access

- Only authenticated users can access files
- Sessions remain active until logout
- Click "Logout" button to sign out
- Sessions expire after inactivity for security

### Uploading Files

1. Click the upload zone or drag files onto it
2. Select one or multiple files
3. Files will be automatically categorized as Documents or Media
4. View your uploaded files in the grid below

### Downloading Files

1. Click the "Download" button on any file card
2. The file will be downloaded to your device's default download location

### Deleting Files

1. Click the trash icon on any file card
2. Confirm the deletion
3. The file will be removed from storage

### Filtering Files

Use the filter buttons to view:
- **All Files**: Show everything
- **Documents**: Show only documents (PDF, Word, Excel, etc.)
- **Media**: Show only media files (images and videos)

## File Type Support

### Documents
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)
- Text files (.txt)
- CAD drawings (.dwg, .dxf)

### Media
- Images: JPG, JPEG, PNG, GIF, WebP, SVG
- Videos: MP4, MOV, AVI, MKV, WebM

## Project Structure

```
web-storage/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Upload API endpoint
│   ├── components/
│   │   ├── FileCard.tsx          # File display component
│   │   └── UploadZone.tsx        # Upload interface
│   ├── actions.ts                 # Server actions
│   ├── db.ts                      # File database operations
│   ├── types.ts                   # TypeScript types
│   ├── utils.ts                   # Utility functions
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── public/
│   └── uploads/                   # Uploaded files storage
├── data/
│   └── files.json                 # File metadata database
└── package.json
```

## Configuration

### Upload Size Limit

The default upload size limit is 50MB. To change this, modify `next.config.js`:

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '50mb', // Change this value
  },
}
```

## Development

### Local Development

```bash
npm run dev
```

Open http://localhost:3000

### Building for Production

**⚠️ BEFORE DEPLOYING TO PRODUCTION:**

1. **Read [SECURITY.md](SECURITY.md) completely**
2. **Read [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific instructions**
3. Change all default credentials
4. Generate secure `AUTH_SECRET`
5. Use HTTPS (SSL/TLS)
6. Set environment variables on your hosting platform

Then build:

```bash
npm run build
npm start
```

## 🌐 Deployment

### Cloudflare Pages (Custom Subdomain) ⭐ 

**Perfect for:** Your own domain with custom subdomains (e.g., storage.yourdomain.com)

```bash
# Test build first
bash scripts/test-build.sh

# Deploy via GitHub (recommended)
# 1. Push to GitHub
# 2. Connect in Cloudflare Pages dashboard
# 3. Add environment variables
# 4. Set custom subdomain

# OR deploy via CLI
npm run build
npx wrangler pages deploy .next --project-name=web-storage
```

**See [CLOUDFLARE-DEPLOY.md](CLOUDFLARE-DEPLOY.md) for complete instructions.**

**Note:** Current version uses Next.js 15 (compatible with Cloudflare). File storage resets on deployment unless you add R2 storage.

---

### Other Deployment Options

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Quick Options:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Docker:**
```bash
docker-compose up -d
```

**VPS (Ubuntu/Debian):**
```bash
sudo bash scripts/deploy-vps.sh
```

### Linting

```bash
npm run lint
```

## Notes

### Security

- **Default credentials are admin/changeme123** - Change these immediately!
- All routes are protected by authentication
- Files are only accessible to logged-in users
- See [SECURITY.md](SECURITY.md) for comprehensive security guidance
- Never commit `.env.local` to version control
- Always use HTTPS in production

### Storage

- Files are stored in the `public/uploads` directory
- File metadata is stored in `data/files.json`
- This is a secure application with authentication - for production use, also consider:
  - Using environment-specific `.env` files
  - Implementing 2FA (Two-Factor Authentication)
  - Adding rate limiting for login attempts
  - Using a proper database (PostgreSQL, MongoDB, etc.)
  - Implementing cloud storage (AWS S3, Google Cloud Storage, etc.)
  - Adding user roles and permissions
  - Implementing file permissions and access control
  - Adding file compression and optimization
  - Implementing virus scanning for uploaded files
  - Using a CDN for file delivery
  - Setting up automated backups
  - Monitoring and logging access

## License

MIT
