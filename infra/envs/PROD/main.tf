# ============================
# Security Group para Producción
# ============================
module "prod_sg_nginx" {
  source  = "../../modules/security_group"
  name    = "prod-nginx-sg"
  vpc_id  = var.vpc_id
}

# ============================
# EC2 para microservicio: create-customer
# ============================
module "prod_create_customer" {
  source             = "../../modules/ec2_instance"
  ami                = var.ami
  instance_type      = var.instance_type
  key_name           = var.key_name
  subnet_id          = var.subnet_id_1
  security_group_id  = module.prod_sg_nginx.id
  name               = "prod-create-customer"
  user_data          = file("../../scripts/userdata-create-customer.sh")
}

# ============================
# EC2 para microservicio: delete-customer
# ============================
module "prod_delete_customer" {
  source             = "../../modules/ec2_instance"
  ami                = var.ami
  instance_type      = var.instance_type
  key_name           = var.key_name
  subnet_id          = var.subnet_id_2
  security_group_id  = module.prod_sg_nginx.id
  name               = "prod-delete-customer"
  user_data          = file("../../scripts/userdata-delete-customer.sh")
}

# ============================
# API Gateway (Nginx) para Producción
# ============================
module "prod_nginx_gateway" {
  source             = "../../modules/nginx_gateway"
  ami                = var.ami
  instance_type      = var.instance_type
  key_name           = var.key_name
  subnet_id          = var.subnet_id_1
  security_group_id  = module.prod_sg_nginx.id
  name               = "prod-nginx-gateway"
  create_customer_ip = module.prod_create_customer.public_ip
  delete_customer_ip = module.prod_delete_customer.public_ip
}
