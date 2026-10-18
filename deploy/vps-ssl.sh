#!/usr/bin/env bash
set -eu

DOMAIN="www.firstview.1tlt.ru"
DOMAIN_ROOT="firstview.1tlt.ru"
PORT="3025"
ACCOUNT="b9ad4222dfedb2908ec2e746a90e3007"

echo "==> Issue cert"
certbot certonly --apache \
  --account "${ACCOUNT}" \
  -d "${DOMAIN}" \
  -d "${DOMAIN_ROOT}" \
  --non-interactive \
  --agree-tos \
  --email admin@1tlt.ru \
  --keep-until-expiring \
  --no-eff-email

CERT_DIR=""
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
elif [ -f "/etc/letsencrypt/live/${DOMAIN_ROOT}/fullchain.pem" ]; then
  CERT_DIR="/etc/letsencrypt/live/${DOMAIN_ROOT}"
else
  echo "Certificate not found"
  ls -la /etc/letsencrypt/live || true
  exit 1
fi

echo "==> SSL vhost using ${CERT_DIR}"
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

a2ensite firstview.1tlt.ru.conf >/dev/null
a2ensite firstview.1tlt.ru-le-ssl.conf >/dev/null
apache2ctl configtest
systemctl reload apache2

echo "==> Checks"
apache2ctl -S 2>&1 | grep -i firstview || true
curl -sI "http://${DOMAIN}" | head -12 || true
curl -sI "https://${DOMAIN}" | head -20 || true
curl -sI "https://${DOMAIN_ROOT}" | head -12 || true
echo DONE
