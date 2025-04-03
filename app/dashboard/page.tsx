"use client";

import React from "react";
import TransactionHistory from "@/components/TransactionHistory";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const DashboardPage: React.FC = () => {
  const { account, connected, disconnect, wallet } = useWallet();
  return (
    <>
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* 顶部标题和 “View on Github” 按钮 */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 lg:mb-0">Dashboard</h1>
        </div>
        {!account && <h1 className="text-2xl font-bold mb-4 lg:mb-0">Please Login First.</h1>}
        {/* 顶部四个统计卡片 */}
        {account && (
          <div>
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

            {/* 中间图表区域：Bar Chart + Doughnut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Bar Chart</h2>
                </div>
                <div className="h-60 flex items-center justify-center text-gray-400">
                  Bar Chart Placeholder
                </div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Doughnut Chart</h2>
                </div>
                <div className="h-60 flex items-center justify-center text-gray-400">
                  Doughnut Chart Placeholder
                </div>
              </div>
            </div>

            {/* 下方区域：Active users + Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                  Active users right now
                </h2>
                <div className="text-2xl font-bold mb-4">82 Users</div>
                <div className="h-40 flex items-center justify-center text-gray-400">
                  Active Users Chart Placeholder
                </div>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Line Chart</h2>
                </div>
                <div className="h-40 flex items-center justify-center text-gray-400">
                  Line Chart Placeholder
                </div>
              </div>
            </div>

            {/* TransactionHistory 组件 */}
            <TransactionHistory />
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
