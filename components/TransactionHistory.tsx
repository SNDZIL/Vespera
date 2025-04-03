"use client";

import React from "react";
import { transactions } from "../data/transactions"; // 根据实际路径调整

const TransactionHistory: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-gray-600 font-semibold">
                Transaction Hash
              </th>
              <th className="py-2 px-4 text-gray-600 font-semibold">
                Consumer
              </th>
              <th className="py-2 px-4 text-gray-600 font-semibold">
                Amount
              </th>
              <th className="py-2 px-4 text-gray-600 font-semibold">Time</th>
              <th className="py-2 px-4 text-gray-600 font-semibold">
                Repayment Time
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-3 px-4">{tx.transactionHash}</td>
                <td className="py-3 px-4">{tx.buyer}</td>
                <td className="py-3 px-4">{tx.amount}</td>
                <td className="py-3 px-4">{tx.time}</td>
                <td className="py-3 px-4">{tx.repaymentTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
