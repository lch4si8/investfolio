# ══════════════════════════════════════════════════════════
# Lambda Functions (arm64)
# ══════════════════════════════════════════════════════════


# ─── IAM Role ───────────────────────────────────────────
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ─── Shared Config ──────────────────────────────────────
locals {
  lambda_environment = {
    DB_HOST         = aws_db_instance.postgres.address
    DB_PORT         = tostring(aws_db_instance.postgres.port)
    DB_NAME         = var.db_name
    DB_USER         = var.db_username
    DB_PASSWORD     = var.db_password
    DB_SSL          = "true"
    FMP_API_KEY     = var.fmp_api_key
    DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001"
  }

  lambda_defaults = {
    runtime       = "nodejs22.x"
    architectures = ["arm64"]
    timeout       = 10
    memory_size   = 128
  }
}

# ─── getPortfolio ───────────────────────────────────────
resource "aws_lambda_function" "get_portfolio" {
  function_name = "${var.project_name}-getPortfolio"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = local.lambda_defaults.runtime
  architectures = local.lambda_defaults.architectures
  timeout       = local.lambda_defaults.timeout
  memory_size   = local.lambda_defaults.memory_size

  filename         = "${path.module}/../backend/dist/getPortfolio.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist/getPortfolio.zip")

  environment {
    variables = local.lambda_environment
  }
}

# ─── getTransactions ────────────────────────────────────
resource "aws_lambda_function" "get_transactions" {
  function_name = "${var.project_name}-getTransactions"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = local.lambda_defaults.runtime
  architectures = local.lambda_defaults.architectures
  timeout       = local.lambda_defaults.timeout
  memory_size   = local.lambda_defaults.memory_size

  filename         = "${path.module}/../backend/dist/getTransactions.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist/getTransactions.zip")

  environment {
    variables = local.lambda_environment
  }
}

# ─── addTransaction ─────────────────────────────────────
resource "aws_lambda_function" "add_transaction" {
  function_name = "${var.project_name}-addTransaction"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = local.lambda_defaults.runtime
  architectures = local.lambda_defaults.architectures
  timeout       = local.lambda_defaults.timeout
  memory_size   = local.lambda_defaults.memory_size

  filename         = "${path.module}/../backend/dist/addTransaction.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist/addTransaction.zip")

  environment {
    variables = local.lambda_environment
  }
}

# ─── deleteTransaction ──────────────────────────────────
resource "aws_lambda_function" "delete_transaction" {
  function_name = "${var.project_name}-deleteTransaction"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = local.lambda_defaults.runtime
  architectures = local.lambda_defaults.architectures
  timeout       = local.lambda_defaults.timeout
  memory_size   = local.lambda_defaults.memory_size

  filename         = "${path.module}/../backend/dist/deleteTransaction.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist/deleteTransaction.zip")

  environment {
    variables = local.lambda_environment
  }
}

# ─── syncPrices ─────────────────────────────────────────
resource "aws_lambda_function" "sync_prices" {
  function_name = "${var.project_name}-syncPrices"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = local.lambda_defaults.runtime
  architectures = local.lambda_defaults.architectures
  timeout       = 30 # Needs more time for external API calls
  memory_size   = local.lambda_defaults.memory_size

  filename         = "${path.module}/../backend/dist/syncPrices.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist/syncPrices.zip")

  environment {
    variables = local.lambda_environment
  }
}
