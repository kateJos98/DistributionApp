output "public_ip" {
  value = aws_instance.nginx_gateway.public_ip
}
