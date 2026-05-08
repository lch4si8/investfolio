import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-transaction-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>{{ data.assetType === 'stock' ? 'show_chart' : 'currency_bitcoin' }}</mat-icon>
      Add {{ data.assetType === 'stock' ? 'Stock' : 'Crypto' }} Transaction
    </h2>

    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Symbol</mat-label>
        <input matInput [(ngModel)]="symbol" placeholder="e.g. {{ data.assetType === 'stock' ? 'AAPL' : 'bitcoin' }}" required>
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Transaction Type</mat-label>
        <mat-select [(ngModel)]="type">
          <mat-option value="buy">Buy</mat-option>
          <mat-option value="sell">Sell</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="quantity" min="0" step="any" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price (USD)</mat-label>
          <input matInput type="number" [(ngModel)]="price" min="0" step="any" required>
          <span matPrefix>$&nbsp;</span>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="date">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      @if (quantity > 0 && price > 0) {
        <div class="total-preview">
          <span>Total</span>
          <span class="total-value">\${{ (quantity * price).toFixed(2) }}</span>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="!isValid()">
        <mat-icon>check</mat-icon>
        Add Transaction
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #f8fafc;
      font-size: 20px;
      font-weight: 600;
    }

    .dialog-title mat-icon {
      color: #818cf8;
      filter: drop-shadow(0 0 6px rgba(129, 140, 248, 0.4));
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      min-width: 420px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 14px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .total-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: rgba(129, 140, 248, 0.08);
      border-radius: 10px;
      border: 1px solid rgba(129, 140, 248, 0.2);
      backdrop-filter: blur(8px);
      margin-top: 4px;
    }

    .total-preview span:first-child {
      color: #94a3b8;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 500;
    }

    .total-value {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.5px;
    }

    .dialog-actions {
      padding: 16px 24px;
      gap: 8px;
    }
  `],
})
export class AddTransactionDialog {
  private dialogRef = inject(MatDialogRef<AddTransactionDialog>);
  data: { assetType: 'stock' | 'crypto' } = inject(MAT_DIALOG_DATA);

  symbol = '';
  type: 'buy' | 'sell' = 'buy';
  quantity = 0;
  price = 0;
  date = new Date();

  isValid(): boolean {
    return this.symbol.trim().length > 0 && this.quantity > 0 && this.price > 0;
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    this.dialogRef.close({
      assetSymbol: this.symbol.trim().toUpperCase(),
      assetType: this.data.assetType,
      type: this.type,
      quantity: this.quantity,
      price: this.price,
      date: this.date.toISOString(),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
