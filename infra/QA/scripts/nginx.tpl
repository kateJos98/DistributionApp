#!/bin/bash
apt update -y
apt install -y nginx
systemctl enable nginx
systemctl start nginx

cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;

    location /auth/ {
        proxy_pass http://AUTH_IP:8001/;
    }

    location /authorization/ {
        proxy_pass http://AUTHZ_IP:8002/;
    }
}
EOF

systemctl restart nginx
