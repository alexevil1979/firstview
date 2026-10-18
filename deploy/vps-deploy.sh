#!/usr/bin/env bash
set -eu

APP_DIR="/ssd/www/firstview"
REPO="https://github.com/alexevil1979/firstview.git"
DOMAIN="www.firstview.1tlt.ru"
DOMAIN_ROOT="firstview.1tlt.ru"
PORT="3025"
SERVICE="firstview"

echo "==> Stop stuck install processes"
pkill -f "/ssd/www/firstview/node_modules" 2>/dev/null || true
sleep 1

echo "==> Fresh clone"
cp -a "${APP_DIR}/.env" /tmp/firstview.env.bak 2>/dev/null || true
rm -rf "${APP_DIR}"
git clone -b main "${REPO}" "${APP_DIR}"
cd "${APP_DIR}"

cat > "${APP_DIR}/.env" <<EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkwalker?schema=public"
NEXT_PUBLIC_APP_URL="https://${DOMAIN}"
NODE_ENV=production
PORT=${PORT}
HOSTNAME=127.0.0.1
EOF

echo "==> Install & build"
export CI=1
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false
mkdir -p /var/www
chown -R www-data:www-data /var/www
chown -R www-data:www-data "${APP_DIR}"
# Install as root (reliable on this host), then hand over to www-data
rm -rf "${APP_DIR}/node_modules" "${APP_DIR}/.next"
cd "${APP_DIR}"
npm install --no-fund --no-audit
npm run build
chown -R www-data:www-data "${APP_DIR}"

echo "==> Systemd unit"
cat > "/etc/systemd/system/${SERVICE}.service" <<EOF
[Unit]
Description=LinkWalker / FirstView (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=${APP_DIR}
Environment=HOME=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${PORT}
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "${SERVICE}"
systemctl restart "${SERVICE}"
sleep 3
systemctl --no-pager --full status "${SERVICE}" || true

echo "==> Apache modules"
a2enmod proxy proxy_http headers rewrite ssl >/dev/null

echo "==> Apache HTTP vhost"
cat > /etc/apache2/sites-available/firstview.1tlt.ru.conf <<EOF
<VirtualHost *:80>
    ServerName ${DOMAIN_ROOT}
    ServerAlias ${DOMAIN}

    ErrorLog \${APACHE_LOG_DIR}/firstview.1tlt.ru-error.log
    CustomLog \${APACHE_LOG_DIR}/firstview.1tlt.ru-access.log combined

    ProxyPreserveHost On
    ProxyRequests Off
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"

    ProxyPass / http://127.0.0.1:${PORT}/ connectiontimeout=5 timeout=300
    ProxyPassReverse / http://127.0.0.1:${PORT}/
</VirtualHost>
EOF

a2ensite firstview.1tlt.ru.conf >/dev/null
apache2ctl configtest
systemctl reload apache2

echo "==> Let's Encrypt"
certbot --apache \
  -d "${DOMAIN}" \
  -d "${DOMAIN_ROOT}" \
  --non-interactive \
  --agree-tos \
  --email admin@1tlt.ru \
  --redirect \
  --keep-until-expiring \
  --no-eff-email || true

CERT_DIR=""
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
elif [ -f "/etc/letsencrypt/live/${DOMAIN_ROOT}/fullchain.pem" ]; then
  CERT_DIR="/etc/letsencrypt/live/${DOMAIN_ROOT}"
fi

if [ -n "${CERT_DIR}" ]; then
  echo "==> Write SSL proxy vhost using ${CERT_DIR}"
  cat > /etc/apache2/sites-available/firstview.1tlt.ru-le-ssl.conf <<EOF
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName ${DOMAIN_ROOT}
    ServerAlias ${DOMAIN}

    SSLEngine on
    SSLCertificateFile ${CERT_DIR}/fullchain.pem
    SSLCertificateKeyFile ${CERT_DIR}/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ErrorLog \${APACHE_LOG_DIR}/firstview.1tlt.ru-ssl-error.log
    CustomLog \${APACHE_LOG_DIR}/firstview.1tlt.ru-ssl-access.log combined

    ProxyPreserveHost On
    ProxyRequests Off
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    ProxyPass / http://127.0.0.1:${PORT}/ connectiontimeout=5 timeout=300
    ProxyPassReverse / http://127.0.0.1:${PORT}/
</VirtualHost>
</IfModule>
EOF

  cat > /etc/apache2/sites-available/firstview.1tlt.ru.conf <<EOF
<VirtualHost *:80>
    ServerName ${DOMAIN_ROOT}
    ServerAlias ${DOMAIN}
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>
EOF

  a2ensite firstview.1tlt.ru-le-ssl.conf >/dev/null || true
  apache2ctl configtest
  systemctl reload apache2
fi

echo "==> Health checks"
sleep 2
curl -sI "http://127.0.0.1:${PORT}" | head -8 || true
curl -sI "http://${DOMAIN}" | head -10 || true
curl -skI "https://${DOMAIN}" | head -15 || true
systemctl --no-pager --full status "${SERVICE}" | head -25 || true
echo "DONE"
