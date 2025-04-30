import React from 'react';
import './TransactionHistory.css';

interface Transaction {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions found</p>
      ) : (
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header">
                <div>
                  <h3>Order #{transaction.id}</h3>
                  <p className="transaction-date">{transaction.date}</p>
                </div>
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
              
              <div className="transaction-items">
                {transaction.items.map((item, index) => (
                  <div key={index} className="transaction-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="transaction-footer">
                <span className="total-label">Total:</span>
                <span className="total-amount">${transaction.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 