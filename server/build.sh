#!/bin/bash

echo "🚀 Building React app..."
cd ..
npm run build

echo "📁 Copying built files to server/public..."
mkdir -p server/public
cp -r dist/* server/public/

echo "🔨 Building server..."
cd server
npm run build

echo "✅ Build complete! Server ready for deployment."
echo "📁 Static files location: server/public/"
echo "🚀 Start server with: npm start" 