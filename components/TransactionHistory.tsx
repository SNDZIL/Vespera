"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  transactionHash: string;
  buyer: string;
  amount: string;
  time: string;
  repaymentTime: string;
  isRepaid: boolean;
}

const TransactionHistory: React.FC = () => {
  const [txList, setTxList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 JSON Server 获取数据
  useEffect(() => {
    fetch("http://localhost:8000/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTxList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        setLoading(false);
      });
  }, []);

  // 点击还款按钮后，调用 PATCH 接口更新 isRepaid 状态，并更新本地 state
  const handleRepay = async (tx: Transaction, index: number) => {
    try {
      const response = await fetch(`http://localhost:8000/transactions/${tx.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRepaid: true }),
      });
      if (response.ok) {
        const updatedTx: Transaction = await response.json();
        const updatedTxList = [...txList];
        updatedTxList[index] = updatedTx;
        setTxList(updatedTxList);
      } else {
        console.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        Loading transactions...
      </div>
    );
  }

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
              <th className="py-2 px-4 text-gray-600 font-semibold">Amount</th>
              <th className="py-2 px-4 text-gray-600 font-semibold">Time</th>
              <th className="py-2 px-4 text-gray-600 font-semibold">
                Repayment Time
              </th>
              <th className="py-2 px-4 text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {txList.map((tx, idx) => (
              <tr key={tx.id} className="border-b border-gray-100">
                <td className="py-3 px-4">{tx.transactionHash}</td>
                <td className="py-3 px-4">{tx.buyer}</td>
                <td className="py-3 px-4">{tx.amount}</td>
                <td className="py-3 px-4">{tx.time}</td>
                <td className="py-3 px-4">{tx.repaymentTime}</td>
                <td className="py-3 px-4">
                  {tx.isRepaid ? (
                    <span className="text-green-500">Paid</span>
                  ) : (
                    <button
                      onClick={() => handleRepay(tx, idx)}
                      className="text-lg p-2 rounded-lg transition-all duration-200 border-2 text-blue-500 bg-transparent border-blue-400 hover:bg-blue-400 hover:text-white cursor-pointer"
                    >
                      Repay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
