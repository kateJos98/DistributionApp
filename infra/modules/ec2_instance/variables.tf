variable "ami" {}
variable "instance_type" {}
variable "key_name" {}
variable "subnet_id" {}
variable "security_group_id" {}
variable "name" {}
variable "user_data" {
  default = ""
}
variable "private_key_path" {}