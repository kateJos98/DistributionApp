variable "ami" {}
variable "instance_type" {}
variable "key_name" {}
variable "subnet_id" {}
variable "security_group_id" {}
variable "name" {}

variable "auth_login_ip" {
  type = string
}

variable "authorization_login_ip" {
  type = string
}
