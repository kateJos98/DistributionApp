output "public_ip" {
  value = aws_instance.service.public_ip
}

output "auth_login_ip" {
  value = aws_instance.service.public_ip
}

output "authorization_login_ip" {
  value = aws_instance.service.public_ip
}
