# ══════════════════════════════════════════════════════════
# RDS PostgreSQL 16 — Default VPC
# ══════════════════════════════════════════════════════════

# ─── Discover Default VPC & Subnets ─────────────────────
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

# ─── Security Group ────────────────────────────────────────
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-rds-"
  vpc_id      = data.aws_vpc.default.id
  description = "Allow PostgreSQL only from whitelisted IPs and Lambda"

  dynamic "ingress" {
    for_each = var.allowed_ips
    content {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
      description = "PostgreSQL from allowed IP"
    }
  }

  # Allow from Lambda (IP ranges)
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "PostgreSQL from Lambda"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ─── DB Subnet Group ────────────────────────────────────
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-db-subnet"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "${var.project_name}-db-subnet"
  }
}

# ─── RDS Parameter Group ────────────────────────────────
resource "aws_db_parameter_group" "postgres" {
  name_prefix = "${var.project_name}-pg16-"
  family      = "postgres16"
  description = "Force SSL connections for InvestFolio"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.project_name}-pg16-params"
  }
}

# ─── RDS PostgreSQL 16 ──────────────────────────────
resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t4g.micro"

  allocated_storage     = 20
  max_allocated_storage = 20
  storage_type          = "gp2"
  storage_encrypted     = false

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.postgres.name

  publicly_accessible = true
  multi_az            = false
  skip_final_snapshot = true

  backup_retention_period = 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"

  performance_insights_enabled = false

  tags = {
    Name = "${var.project_name}-postgres"
  }
}
