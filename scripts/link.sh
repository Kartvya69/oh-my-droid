#!/bin/bash
#
# Quick setup for local development using npm link
#

echo "Setting up Oh-My-Droid for local development..."

# Install dependencies
echo "→ Installing dependencies..."
npm install

# Build (ignore errors for now)
echo "→ Building project..."
npm run build 2>/dev/null || echo "Build had errors, continuing..."

# Create npm link
echo "→ Creating npm link..."
npm link

# Setup directories
echo "→ Setting up directories..."
mkdir -p ~/.omd/{state,skills,hooks}
mkdir -p ~/.factory/droids

# Copy droids
cp -r droids/* ~/.factory/droids/ 2>/dev/null || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now use:"
echo "  omd --version"
echo "  omd status"
echo "  omd agents"
echo ""
echo "To uninstall: npm unlink -g oh-my-droid"
