variable "region" {
  description = "AWS region for the deployment"
  type        = string
}
variable "ami" {}
variable "instance_type" {}
variable "key_name" {}
variable "vpc_id" {}
variable "private_key_path" {}
variable "subnet_id_1" {}
variable "subnet_id_2" {}

