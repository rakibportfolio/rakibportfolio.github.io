#!/bin/bash
# ============================================================
#   Portfolio Website - VPS Deploy Script
#   Usage: bash deploy-vps.sh
#   আগে VPS_IP এবং VPS_USER পরিবর্তন করুন
# ============================================================

# ===== CONFIG =====
VPS_IP="YOUR_VPS_IP"          # e.g. 123.456.789.0
VPS_USER="root"               # or your SSH username
VPS_PORT="22"                 # default SSH port
WEB_ROOT="/var/www/html"      # Nginx/Apache web root on VPS
LOCAL_DIR="$(dirname "$0")"   # current portfolio folder

# ===== FILES TO EXCLUDE (dev files, not needed on server) =====
EXCLUDES=(
  ".git"
  ".gitignore"
  "*.py"
  "*.log"
  "node_modules"
  "package*.json"
  "Dockerfile"
  "server.js"
  "dev-server.js"
  "deploy-vps.sh"
  "trailer for edit.mp4"
  "DONE Full With Sound Design .mp4"
  "Website Main Video.mp4"
  "preview_*.png"
  "desktop_*.png"
  "mobile_*.png"
  "tab_*.png"
)

# Build exclude args
EXCLUDE_ARGS=""
for item in "${EXCLUDES[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='$item'"
done

echo "======================================"
echo "  Zentic Media Portfolio - VPS Deploy"
echo "======================================"
echo "Target: $VPS_USER@$VPS_IP:$WEB_ROOT"
echo ""

# Check if rsync is available
if command -v rsync &> /dev/null; then
  echo "[1/2] Uploading files via rsync..."
  eval rsync -avz --progress \
    $EXCLUDE_ARGS \
    -e "ssh -p $VPS_PORT" \
    "$LOCAL_DIR/" \
    "$VPS_USER@$VPS_IP:$WEB_ROOT/"
else
  echo "[1/2] rsync not found, using scp..."
  scp -r -P $VPS_PORT \
    "$LOCAL_DIR/"* \
    "$VPS_USER@$VPS_IP:$WEB_ROOT/"
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deploy successful!"
  echo "🌐 Website: http://$VPS_IP"
else
  echo ""
  echo "❌ Deploy failed. Check your VPS credentials."
fi
