# Security Setup Guide

## 🔒 Security Features

This application now includes:
- **Authentication**: Login required to access any files
- **Password Protection**: Secure credential verification
- **Session Management**: Automatic logout after inactivity
- **Protected Routes**: All routes require authentication
- **Secure File Access**: Files only accessible to authenticated users

## 📝 Initial Setup

### 1. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

### 2. Change Default Credentials

**⚠️ CRITICAL: Change these before deploying!**

Edit `.env.local`:

```env
# Generate a secure secret (run this command):
# openssl rand -base64 32
AUTH_SECRET=your-random-secret-here

# Change these credentials!
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password

# Update this for production
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Generate Secure Secret

Run this command to generate a secure random secret:

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as your `AUTH_SECRET` in `.env.local`

## 🔐 Password Security

### Using Plain Text Passwords (Development Only)

For development, you can use plain text passwords in `.env.local`:
```env
ADMIN_PASSWORD=mysecretpassword
```

### Using Hashed Passwords (Recommended for Production)

For production, use bcrypt-hashed passwords:

1. Generate a hash for your password:

**Create a file called `hash-password.js`:**
```javascript
const bcrypt = require('bcryptjs');
const password = 'your-secure-password'; // Change this
const hash = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hash);
```

2. Run it:
```bash
node hash-password.js
```

3. Copy the hashed password to `.env.local`:
```env
ADMIN_PASSWORD=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🌐 Production Deployment

### Environment Variables Checklist

Before deploying, ensure you have:

- [ ] Changed `AUTH_SECRET` to a random value
- [ ] Changed `ADMIN_USERNAME` from default
- [ ] Changed `ADMIN_PASSWORD` to a strong password (or hash)
- [ ] Updated `NEXTAUTH_URL` to your production domain
- [ ] **NEVER** committed `.env.local` to version control

### Deployment Platforms

#### Vercel
1. Go to your project settings
2. Add Environment Variables:
   - `AUTH_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_URL`
3. Redeploy

#### Netlify
1. Site settings → Environment variables
2. Add the same variables as above
3. Redeploy

#### Docker/VPS
1. Create `.env.local` on server
2. Never expose port 3000 directly - use reverse proxy (nginx)
3. Enable HTTPS with SSL certificate

## 🛡️ Additional Security Recommendations

### For Production

1. **Use HTTPS**: Always use SSL/TLS certificates
   - Let's Encrypt is free and automatic
   - Most hosting platforms provide this

2. **Strong Passwords**: 
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Use a password manager

3. **Regular Updates**:
   ```bash
   npm update
   npm audit fix
   ```

4. **File Upload Limits**: Already configured (50MB max)

5. **Rate Limiting**: Consider adding rate limiting for login attempts

6. **Backup**: Regularly backup your `data/` and `public/uploads/` directories

7. **Firewall**: Configure firewall rules on your server

## 🚨 What NOT To Do

- ❌ Don't commit `.env.local` to Git
- ❌ Don't use default credentials in production
- ❌ Don't share your `AUTH_SECRET`
- ❌ Don't expose environment variables in client-side code
- ❌ Don't run without HTTPS in production

## 📊 Security Checklist

Before going live:

- [ ] Changed all default credentials
- [ ] Generated secure `AUTH_SECRET`
- [ ] Using hashed passwords (or strong plain text)
- [ ] HTTPS enabled
- [ ] Environment variables configured on hosting platform
- [ ] `.env.local` in `.gitignore`
- [ ] Tested login/logout functionality
- [ ] Verified file access requires authentication

## 🔄 Changing Credentials Later

If you need to change your password:

1. Stop the application
2. Update `.env.local` with new credentials
3. Restart the application
4. Test login with new credentials

## 🆘 Troubleshooting

### Can't Login
- Check credentials in `.env.local`
- Verify `AUTH_SECRET` is set
- Clear browser cookies
- Check console for errors

### Session Expires Too Quickly
- This is normal security behavior
- Sessions expire after period of inactivity
- Just log in again

### Forgot Password
- You have direct access to `.env.local`
- Update `ADMIN_PASSWORD` with a new value
- Restart the application

## 📞 Support

If you encounter security issues:
1. Check the troubleshooting section
2. Verify environment variables are correct
3. Check browser console for errors
4. Review Next.js and NextAuth documentation
