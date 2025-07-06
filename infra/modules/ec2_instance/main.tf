resource "aws_instance" "service" {
  ami           = var.ami
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  associate_public_ip_address = true


  tags = {
    Name = var.name
  }

  user_data = var.user_data

}

provider "aws" {
  region = var.region
}