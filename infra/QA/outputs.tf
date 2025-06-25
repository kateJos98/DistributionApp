output "qa_instance_ip" {
  value = aws_eip.qa_ip.public_ip
}

output "prod_instance_ip" {
  value = aws_eip.prod_ip.public_ip
}
