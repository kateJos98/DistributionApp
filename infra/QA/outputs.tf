output "nginx_public_ip" {
  value = aws_instance.nginx_instance.public_ip
}
