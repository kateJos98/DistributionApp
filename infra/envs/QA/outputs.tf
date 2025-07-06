output "auth_login_ip" {
  value = module.qa_auth_login.public_ip
}

output "authorization_login_ip" {
  value = module.qa_authorization_login.public_ip
}

output "nginx_ip" {
  value = module.qa_nginx_gateway.public_ip
}
