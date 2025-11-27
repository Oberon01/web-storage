# 🚀 Quick Start - Secure Setup

## ⚡ 5-Minute Security Setup

### Step 1: Copy Environment File
```bash
cp .env.example .env.local
```

### Step 2: Generate Secure Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output!

### Step 3: Edit .env.local

Open `.env.local` in a text editor and update:

```env
# Paste your generated secret here
AUTH_SECRET=paste-your-generated-secret-here

# Change these credentials
ADMIN_USERNAME=yourusername
ADMIN_PASSWORD=yoursecurepassword

# Update for production (leave as-is for local dev)
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Save and Start
```bash
npm install
npm run dev
```

### Step 5: Test Login
1. Go to http://localhost:3000
2. Login with your new credentials
3. ✅ You're secure!

---

## 🌐 Before Deploying to Production

### Required Changes:
- [ ] Change `AUTH_SECRET` to random value
- [ ] Change `ADMIN_USERNAME` 
- [ ] Change `ADMIN_PASSWORD` (use hashed password - see below)
- [ ] Update `NEXTAUTH_URL` to your domain
- [ ] Enable HTTPS on your server

### Optional: Use Hashed Password

For extra security, hash your password:

```bash
node scripts/hash-password.js yourpassword
```

Copy the output hash to `.env.local`:
```env
ADMIN_PASSWORD=$2a$10$...your-long-hash-here...
```

---

## ✅ Security Checklist

- [ ] `.env.local` file created
- [ ] `AUTH_SECRET` changed from example
- [ ] `ADMIN_USERNAME` changed from 'admin'
- [ ] `ADMIN_PASSWORD` changed from 'changeme123'
- [ ] Tested login with new credentials
- [ ] `.env.local` is in `.gitignore` (already configured)

---

## 🆘 Troubleshooting

**Can't login?**
- Double-check credentials in `.env.local`
- Make sure there are no extra spaces
- Restart the dev server after changing `.env.local`

**Session expires too fast?**
- This is normal - it's a security feature
- Just login again when needed

**Forgot password?**
- Edit `.env.local` and change `ADMIN_PASSWORD`
- Restart the app

---

## 📚 More Information

- Full security guide: [SECURITY.md](SECURITY.md)
- General documentation: [README.md](README.md)

---

**🎉 That's it! You're ready to use your secure web storage.**
