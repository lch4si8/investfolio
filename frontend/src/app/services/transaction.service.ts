import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  transactions = signal<Transaction[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadTransactions(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<any[]>(`${this.apiUrl}/transactions`).subscribe({
      next: (data) => {
        const mappedTransactions: Transaction[] = data.map(t => ({
          id: t.id,
          userId: t.user_id || t.userId,
          assetId: t.asset_id || t.assetId,
          type: t.type,
          quantity: Number(t.quantity),
          priceAtTransaction: Number(t.price_at_transaction || t.priceAtTransaction),
          transactionDate: t.transaction_date || t.transactionDate,
          createdAt: t.created_at || t.createdAt,
          asset: t.asset ? {
            id: t.asset.id,
            symbol: t.asset.symbol,
            name: t.asset.name,
            type: t.asset.type,
            currentPrice: Number(t.asset.current_price || t.asset.currentPrice),
            priceUpdatedAt: t.asset.price_updated_at || t.asset.priceUpdatedAt
          } : undefined
        }));
        this.transactions.set(mappedTransactions);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load transactions');
        this.isLoading.set(false);
      },
    });
  }

  addTransaction(transaction: {
    assetSymbol: string;
    assetType: 'stock' | 'crypto';
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    date: string;
  }): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to add transaction');
        this.isLoading.set(false);
      },
    });
  }

  deleteTransaction(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.delete<void>(`${this.apiUrl}/transactions/${id}`).subscribe({
      next: () => {
        this.transactions.update(txs => txs.filter(t => t.id !== id));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to delete transaction');
        this.isLoading.set(false);
      },
    });
  }
}
