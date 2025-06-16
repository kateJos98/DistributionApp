variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  default     = "us-east-1"
}

variable "key_pair" {
  description = "Nombre del par de claves EC2 para acceso SSH"
  type        = string
  default = "mi-clave-ec2"
}

variable "ami" {
  description = "AMI de Ubuntu 22.04"
  default     = "ami-0c02fb55956c7d316"
}

variable "instance_type" {
  description = "Tipo de instancia"
  default     = "t2.micro"
}

variable "project_tag" {
  default = "distributionapp"
}

variable "db_password" {
  description = "Password de la base de datos"
  type        = string
  sensitive   = true
}
