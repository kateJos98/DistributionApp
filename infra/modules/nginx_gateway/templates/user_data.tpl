#!/bin/bash
sudo apt update -y
sudo apt install -y nginx docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
sudo systemctl start nginx
sudo systemctl enable nginx

cat <<EOF | sudo tee /etc/nginx/conf.d/microservices.conf
server {
    listen 80;

    location /auth-login/ {
        proxy_pass http://${auth_login_ip}:8001/;
    }

    location /authorization-login/ {
        proxy_pass http://${authorization_login_ip}:8002/;
    }
}
EOF

sudo nginx -s reload
