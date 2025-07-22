resource "aws_instance" "nginx_gateway" {
  ami                    = var.ami
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]

  tags = {
    Name = var.name
  }

  user_data = templatefile("${path.module}/templates/user_data.tpl", {
    auth_login_ip          = var.auth_login_ip
    authorization_login_ip = var.authorization_login_ip
  })
}
