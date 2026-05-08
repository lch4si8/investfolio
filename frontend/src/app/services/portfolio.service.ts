import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PortfolioSummary } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Reactive state with Signals
  portfolio = signal<PortfolioSummary | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Computed derived state
  netWorth = computed(() => this.portfolio()?.totalNetWorth ?? 0);
  stocksValue = computed(() => this.portfolio()?.stocksValue ?? 0);
  cryptoValue = computed(() => this.portfolio()?.cryptoValue ?? 0);
  stocksPercentage = computed(() => this.portfolio()?.stocksPercentage ?? 0);
  cryptoPercentage = computed(() => this.portfolio()?.cryptoPercentage ?? 0);

  stockHoldings = computed(() =>
    this.portfolio()?.holdings.filter(h => h.asset.type === 'stock') ?? []
  );

  cryptoHoldings = computed(() =>
    this.portfolio()?.holdings.filter(h => h.asset.type === 'crypto') ?? []
  );

  loadPortfolio(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<PortfolioSummary>(`${this.apiUrl}/portfolio`).subscribe({
      next: (data) => {
        this.portfolio.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load portfolio');
        this.isLoading.set(false);
      },
    });
  }

  syncPrices(): void {
    this.isLoading.set(true);
    this.http.post<void>(`${this.apiUrl}/sync-prices`, {}).subscribe({
      next: () => this.loadPortfolio(),
      error: (err) => {
        this.error.set(err.message || 'Failed to sync prices');
        this.isLoading.set(false);
      },
    });
  }
}
