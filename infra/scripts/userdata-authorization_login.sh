#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Login opcional si tu Docker Hub es privado
# docker login -u <usuario> -p <contraseña>

docker pull katyjoseth719/authorization-login:latest
docker run -d -p 8002:8002 --name authorization-login katyjoseth719/authorization-login:latest
