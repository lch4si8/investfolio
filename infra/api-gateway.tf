# ─── HTTP API Gateway v2 ─────────────────────────────────
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/apigateway/${var.project_name}"
  retention_in_days = 14
}

# ─── Integrations ───────────────────────────────────────
resource "aws_apigatewayv2_integration" "get_portfolio" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_portfolio.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_transactions" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_transactions.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "add_transaction" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.add_transaction.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "delete_transaction" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.delete_transaction.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "sync_prices" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.sync_prices.invoke_arn
  payload_format_version = "2.0"
}

# ─── Routes ─────────────────────────────────────────────
resource "aws_apigatewayv2_route" "get_portfolio" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /api/portfolio"
  target    = "integrations/${aws_apigatewayv2_integration.get_portfolio.id}"
}

resource "aws_apigatewayv2_route" "get_transactions" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /api/transactions"
  target    = "integrations/${aws_apigatewayv2_integration.get_transactions.id}"
}

resource "aws_apigatewayv2_route" "add_transaction" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /api/transactions"
  target    = "integrations/${aws_apigatewayv2_integration.add_transaction.id}"
}

resource "aws_apigatewayv2_route" "delete_transaction" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /api/transactions/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_transaction.id}"
}

resource "aws_apigatewayv2_route" "sync_prices" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /api/sync-prices"
  target    = "integrations/${aws_apigatewayv2_integration.sync_prices.id}"
}

# ─── Lambda Permissions (API Gateway → Lambda) ──────────
resource "aws_lambda_permission" "apigw_get_portfolio" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_portfolio.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_get_transactions" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_transactions.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_add_transaction" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_transaction.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_delete_transaction" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_transaction.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_sync_prices" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_prices.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
