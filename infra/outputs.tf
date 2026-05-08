output "api_gateway_url" {
  description = "Base URL for the HTTP API Gateway"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.postgres.port
}
