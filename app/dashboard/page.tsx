"use client";

import React, { useEffect, useState } from "react";
import TransactionHistory from "@/components/TransactionHistory";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { gerCurrentCredit, getMaxCredit, CoffeeProfile } from "@/data/aptosCoinfig";

const DashboardPage: React.FC = () => {
  const { account } = useWallet();
  const [currentCredit, setCurrentCredit] = useState<number>(0);
  const [maxCredit, setMaxCredit] = useState<number>(0);
  useEffect(() => {
    if (account) {
      gerCurrentCredit(CoffeeProfile).then((value) => {
        console.log(value);
        setCurrentCredit(Number(value));
      });
      getMaxCredit(CoffeeProfile).then((value) => {
        console.log(value);
        setMaxCredit(Number(value));
      });
    }
  }, [account]);
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* 顶部标题 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 lg:mb-0">Dashboard</h1>
      </div>
      {!account && (
        <h1 className="text-2xl font-bold mb-4 lg:mb-0">Please Login First.</h1>
      )}
      {account && (
        <div>
          {/* 顶部统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-md shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">Sales</span>
              <span className="text-2xl font-bold">$300,000</span>
              <span className="text-green-500 text-sm mt-1">+4.6%</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">Customers</span>
              <span className="text-2xl font-bold">50,021</span>
              <span className="text-red-500 text-sm mt-1">-2.6%</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="text-2xl font-bold">45,021</span>
              <span className="text-green-500 text-sm mt-1">+3.6%</span>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">Tickets</span>
              <span className="text-2xl font-bold">20,516</span>
              <span className="text-green-500 text-sm mt-1">+3.1%</span>
            </div>
          </div>

          {/* TransactionHistory 组件 */}
          <TransactionHistory />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
