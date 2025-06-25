resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "qa_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "prod_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main_vpc.id
}

resource "aws_route_table" "route" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "qa_assoc" {
  subnet_id      = aws_subnet.qa_subnet.id
  route_table_id = aws_route_table.route.id
}

resource "aws_route_table_association" "prod_assoc" {
  subnet_id      = aws_subnet.prod_subnet.id
  route_table_id = aws_route_table.route.id
}

resource "aws_security_group" "microservice_sg" {
  name        = "microservice-sg"
  description = "Allow SSH and app ports"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "qa_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.qa_subnet.id
  vpc_security_group_ids = [aws_security_group.microservice_sg.id]
  key_name               = var.key_name
  tags = {
    Name = "qa-auth-service"
  }
}

resource "aws_instance" "prod_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.prod_subnet.id
  vpc_security_group_ids = [aws_security_group.microservice_sg.id]
  key_name               = var.key_name
  tags = {
    Name = "prod-create-customer"
  }
}

resource "aws_eip" "qa_ip" {
  instance = aws_instance.qa_instance.id
  vpc      = true
}

resource "aws_eip" "prod_ip" {
  instance = aws_instance.prod_instance.id
  vpc      = true
}
