#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

docker pull katyjoseth719/auth-login:latest
docker run -d -p 8001:8001 --name auth-login katyjoseth719/auth-login:latest
