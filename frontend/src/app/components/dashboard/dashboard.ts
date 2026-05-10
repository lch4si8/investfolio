import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    CurrencyPipe,
    PercentPipe,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  portfolioService = inject(PortfolioService);

  // Chart data derived from portfolio signals
  allocationChartData = computed<ChartData<'doughnut'>>(() => {
    const p = this.portfolioService.portfolio();
    if (!p) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: ['Stocks', 'Crypto'],
      datasets: [
        {
          data: [p.stocksValue, p.cryptoValue],
          backgroundColor: ['#6366f1', '#f59e0b'],
          borderColor: ['#4f46e5', '#d97706'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  });

  allocationChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 13, family: 'Roboto' },
        },
      },
    },
  };

  holdingsChartData = computed<ChartData<'bar'>>(() => {
    const p = this.portfolioService.portfolio();
    if (!p) {
      return { labels: [], datasets: [] };
    }
    const top = p.holdings.slice(0, 8);
    return {
      labels: top.map(h => h.asset.symbol),
      datasets: [
        {
          label: 'Current Value',
          data: top.map(h => h.currentValue),
          backgroundColor: top.map(h =>
            h.asset.type === 'stock' ? '#6366f1' : '#f59e0b'
          ),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  });

  holdingsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (value) => '€' + Number(value).toLocaleString(),
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
    },
  };

  // Top movers
  topGainers = computed(() => {
    const p = this.portfolioService.portfolio();
    if (!p) return [];
    return [...p.holdings]
      .sort((a, b) => b.profitLossPercentage - a.profitLossPercentage)
      .slice(0, 3);
  });

  topLosers = computed(() => {
    const p = this.portfolioService.portfolio();
    if (!p) return [];
    return [...p.holdings]
      .sort((a, b) => a.profitLossPercentage - b.profitLossPercentage)
      .slice(0, 3);
  });

  ngOnInit(): void {
    this.portfolioService.syncPrices();
  }

  onRefresh(): void {
    this.portfolioService.syncPrices();
  }
}
