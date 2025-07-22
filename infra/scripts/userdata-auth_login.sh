#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

docker pull katyjoseth719/auth-service:latest
docker run -d -p 8001:8000 --name auth-service katyjoseth719/auth-login:latest
