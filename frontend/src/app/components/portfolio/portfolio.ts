import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, PercentPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { PortfolioService } from '../../services/portfolio.service';
import { AddTransactionDialog } from './add-transaction-dialog';

@Component({
  selector: 'app-portfolio',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    CurrencyPipe,
    PercentPipe,
    DatePipe,
    UpperCasePipe,
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio implements OnInit {
  transactionService = inject(TransactionService);
  portfolioService = inject(PortfolioService);
  private dialog = inject(MatDialog);

  selectedTab = signal(0);

  displayedColumnsHoldings = ['symbol', 'name', 'quantity', 'avgCost', 'currentPrice', 'value', 'profitLoss'];
  displayedColumnsTransactions = ['date', 'symbol', 'type', 'quantity', 'price', 'total', 'actions'];

  ngOnInit(): void {
    this.transactionService.loadTransactions();
    this.portfolioService.loadPortfolio();
  }

  openAddDialog(assetType: 'stock' | 'crypto'): void {
    const dialogRef = this.dialog.open(AddTransactionDialog, {
      width: '480px',
      data: { assetType },
      panelClass: 'dark-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.addTransaction(result);
        // Reload portfolio after a short delay
        setTimeout(() => this.portfolioService.loadPortfolio(), 500);
      }
    });
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
    setTimeout(() => this.portfolioService.loadPortfolio(), 500);
  }

  onTabChange(index: number): void {
    this.selectedTab.set(index);
  }
}
