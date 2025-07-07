resource "aws_instance" "nginx_gateway" {
  ami                    = var.ami
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]

  tags = {
    Name = var.name
  }

  dynamic "user_data" {
    for_each = var.user_data != "" ? [1] : []
    content {
      content = var.user_data
    }
  }
}
