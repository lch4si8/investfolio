# InvestFolio 📊

A lightweight full-stack investment portfolio tracker for stocks and cryptocurrencies, designed as a small and straightforward application with a strong focus on minimizing deployment and operating costs.

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| **Frontend**       | Angular 21 + Material 21 + Chart.js |
| **Backend**        | AWS Lambda (Node.js 22, arm64)      |
| **Database**       | PostgreSQL 16 (RDS, Graviton)       |
| **Infrastructure** | Terraform                           |
| **Price APIs**     | FMP (Stocks) + CoinGecko (Crypto)   |

## Project Structure

```
proyecto/
├── frontend/     # Angular 21 app
├── backend/      # Lambda functions (Node.js 22)
├── infra/        # Terraform IaC
└── README.md
```

## Getting Started

### Run the Frontend

```bash
cd frontend
npm install
npx ng serve     # → http://localhost:4200
```

### Build the Backend

```bash
cd backend
npm install
npm run build    # Bundles handlers with esbuild
```

### Deploy the Infrastructure

```bash
cd infra
terraform init
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

## Environment Variables

### Backend Lambda

| Variable      | Description                     |
| ------------- | ------------------------------- |
| `DB_HOST`     | PostgreSQL host                 |
| `DB_PORT`     | PostgreSQL port (5432)          |
| `DB_NAME`     | Database name                   |
| `DB_USER`     | Database username               |
| `DB_PASSWORD` | Database password               |
| `FMP_API_KEY` | Financial Modeling Prep API key |

## API Endpoints

| Method | Path                     | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/api/portfolio`         | Portfolio summary + net worth    |
| GET    | `/api/transactions`      | List all transactions            |
| POST   | `/api/transactions`      | Add buy/sell transaction         |
| DELETE | `/api/transactions/{id}` | Delete transaction               |
| POST   | `/api/sync-prices`       | Sync prices from FMP + CoinGecko |
