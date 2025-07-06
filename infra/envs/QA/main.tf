# ============================
# Provider
# ============================
provider "aws" {
  region = var.region
}


# ============================
# Security Group
# ============================
module "qa_sg_nginx" {
  source = "../../modules/security_group"
  name   = "qa-nginx-sg"
  vpc_id = var.vpc_id
}

# ============================
# EC2 - auth_login
# ============================
module "qa_auth_login" {
  source            = "../../modules/ec2_instance"
  ami               = var.ami
  instance_type     = var.instance_type
  key_name          = var.key_name
  subnet_id         = var.subnet_id_1
  security_group_id = module.qa_sg_nginx.id
  name              = "qa-auth-login"
  private_key_path  = var.private_key_path
  user_data         = file("../../scripts/userdata-auth_login.sh")
}

# ============================
# EC2 - authorization_login
# ============================
module "qa_authorization_login" {
  source            = "../../modules/ec2_instance"
  ami               = var.ami
  instance_type     = var.instance_type
  key_name          = var.key_name
  subnet_id         = var.subnet_id_2
  security_group_id = module.qa_sg_nginx.id
  name              = "qa-authorization-login"
  user_data         = file("../../scripts/userdata-authorization_login.sh")
  private_key_path  = var.private_key_path
}

# ============================
# NGINX Gateway
# ============================
module "qa_nginx_gateway" {
  source                 = "../../modules/nginx_gateway"
  ami                    = var.ami
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id_1
  security_group_id      = module.qa_sg_nginx.id
  name                   = "qa-nginx-gateway"
  auth_login_ip          = module.qa_auth_login.public_ip
  authorization_login_ip = module.qa_authorization_login.public_ip
}

