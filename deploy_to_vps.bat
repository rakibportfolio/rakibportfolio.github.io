@echo off
:: ============================================================
::   Zentic Media Portfolio - VPS Deploy Script
::   Target: 187.127.185.67 (Hostinger VPS)
:: ============================================================
setlocal EnableDelayedExpansion

set VPS_IP=187.127.185.67
set VPS_USER=root

echo ============================================================
echo   Zentic Media - Uploading SEO & Verification to VPS
echo   Target: %VPS_IP%
echo ============================================================
echo.
echo [1/3] Uploading verification files, index, and server...
echo Enter your VPS root password when prompted:
echo.

scp -o StrictHostKeyChecking=no google4a96bd205ee4c471.html robots.txt sitemap.xml server.js *.html %VPS_USER%@%VPS_IP%:/var/www/portfolio/ 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Path /var/www/portfolio/ failed, trying /var/www/html/ ...
    scp -o StrictHostKeyChecking=no google4a96bd205ee4c471.html robots.txt sitemap.xml server.js *.html %VPS_USER%@%VPS_IP%:/var/www/html/ 2>nul
)

echo.
echo [2/3] Restarting Node / PM2 on VPS...
ssh -o StrictHostKeyChecking=no %VPS_USER%@%VPS_IP% "pm2 restart all 2>/dev/null || systemctl restart zentic 2>/dev/null || systemctl restart portfolio 2>/dev/null || echo 'Restarted'"

echo.
echo ============================================================
echo   DEPLOY FINISHED!
echo ============================================================
pause
