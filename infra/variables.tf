variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "investfolio"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "investfolio"
  sensitive   = true
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "investfolio"
}

variable "fmp_api_key" {
  description = "Financial Modeling Prep API key"
  type        = string
  sensitive   = true
}

variable "allowed_ips" {
  description = "CIDR blocks allowed to connect to RDS (your IP, CI, etc.)"
  type        = list(string)
  default     = []
  # Example: ["203.0.113.42/32", "198.51.100.0/24"]
}
