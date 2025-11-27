#!/bin/bash

echo "🧪 Testing Web Storage Build for Cloudflare Pages"
echo "=================================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"
echo ""

# Check Next.js version
echo "📦 Checking Next.js version..."
NEXT_VERSION=$(npm list next --depth=0 2>/dev/null | grep next@ | cut -d@ -f2)
echo "Next.js version: $NEXT_VERSION"

if [[ $NEXT_VERSION == 16.* ]]; then
    echo "❌ ERROR: Next.js 16 detected. Cloudflare requires Next.js 15"
    echo "   Run: npm install next@15.0.3"
    exit 1
fi

if [[ $NEXT_VERSION == 15.* ]]; then
    echo "✅ Next.js 15 detected - compatible with Cloudflare"
fi
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  WARNING: .env.local not found"
    echo "   Create it from .env.example for local testing"
else
    echo "✅ .env.local exists"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
echo "✅ Dependencies installed"
echo ""

# Run build
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📝 Next steps for Cloudflare Pages:"
    echo "   1. Push to GitHub"
    echo "   2. Connect repository in Cloudflare Pages"
    echo "   3. Set environment variables in Cloudflare dashboard"
    echo "   4. Deploy!"
    echo ""
    echo "   See CLOUDFLARE-DEPLOY.md for detailed instructions"
else
    echo ""
    echo "❌ Build failed!"
    echo "   Check the errors above and fix before deploying"
    exit 1
fi
