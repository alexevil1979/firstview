#!/usr/bin/env bash
set -eu

APP_DIR="/ssd/www/firstview"

cd "${APP_DIR}"
git config --global --add safe.directory "${APP_DIR}" 2>/dev/null || true
git fetch origin main
git reset --hard origin/main

export CI=1
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false

npm install --no-fund --no-audit
npm run build
chown -R www-data:www-data "${APP_DIR}"
systemctl restart firstview
sleep 2
systemctl --no-pager --full status firstview | head -20
curl -sI https://www.firstview.1tlt.ru | head -8 || true
echo SYNC_DONE
