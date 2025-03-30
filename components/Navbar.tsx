"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/** 隐藏地址显示，例如 0x1234...abcd */
export function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 7) + "..." + address.slice(-5);
}

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("jwt");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("walletChanged"));
    }
  }, []);

  /** 点击连接按钮时执行连接+签名+登录流程 */
  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed.");
      console.error("MetaMask is not installed.");
      return;
    }

    try {
      // 1. 请求用户连接钱包，获取地址
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const account = String(accounts[0]);
      console.log("Connected account:", account);

      // 2. 请求后端 nonce
      const nonceRes = await axios.post(
        "http://localhost:3333/auth/request-nonce",
        {
          address: account,
        }
      );
      const nonce = nonceRes.data.nonce;
      console.log("Received nonce:", nonce);

      // 3. 使用钱包对 nonce 进行签名
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonce, account],
      });
      console.log("Signature:", signature);

      // 4. 调用登录接口，获取 JWT
      const loginRes = await axios.post("http://localhost:3333/auth/login", {
        address: account,
        signature,
      });
      const loginData = loginRes.data;
      console.log("Login response:", loginData);

      // 5. 登录成功后保存 JWT 和钱包地址到 localStorage，再更新状态
      if (loginData.access_token) {
        localStorage.setItem("jwt", loginData.access_token);
        localStorage.setItem("walletAddress", account);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("walletChanged"));
        }
        // console.log('JWT and walletAddress saved');
        toast.success("Wallet connected successfully!");
        setWalletAddress(account);
      } else {
        // console.error('login fail：', loginData);
        setWalletAddress(null);
        toast.error("Failed to log in.");
      }
    } catch (error) {
      // console.error('The connecting process or authtication process is wrong：', error);
      setWalletAddress(null);
      toast.error(`Failed to connect wallet. ${error}`);
    }
  };

  /** 注销逻辑：移除 localStorage 中的 jwt 和 walletAddress */
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("walletAddress");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("walletChanged"));
    }
    setWalletAddress(null);
    setShowDropdown(false);
    toast.success("Logged out successfully.");
  };

  /**
   * 如果未连接，点击按钮执行连接流程；
   * 如果已连接，则仅通过鼠标悬浮控制下拉菜单显示。
   */
  const handleButtonClick = () => {
    if (!walletAddress) {
      handleConnectWallet();
    }
  };

  return (
    <>
      <Toaster />
      {/* 主导航栏 */}
      <nav className="grotesk fixed top-0 left-0 w-full flex items-center justify-between mb-10 px-4 py-6 md:px-6 lg:py-10 border-b border-b-gray-400 bg-white z-50 upper">
        {/* 左侧 Logo 和导航链接 */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl md:text-3xl font-bold text-black">
            SIGHT Confidential ERC20
          </Link>
          <div className="hidden lg:inline-flex space-x-6">
            <Link
              href="/faucet"
              className="text-xl text-black hover:underline hover:text-blue-400"
            >
              CERC20 Faucet
            </Link>
            <Link
              href="/balance"
              className="text-xl text-black hover:underline hover:text-blue-400"
            >
              CERC20 Balance
            </Link>
          </div>
        </div>

        {/* 右侧：钱包按钮与移动端菜单图标 */}
        <div className="flex items-center">
          <div
            className="relative inline-block"
            onMouseEnter={() => walletAddress && setShowDropdown(true)}
            onMouseLeave={() => walletAddress && setShowDropdown(false)}
          >
            <button
              onClick={handleButtonClick}
              className="bg-blue-400 hover:bg-blue-500 px-8 py-3 lg:text-lg font-semibold uppercase rounded text-white cursor-pointer"
            >
              {walletAddress ? shortenAddress(walletAddress) : "Connect Wallet"}
            </button>

            {walletAddress && showDropdown && (
              <div className="absolute right-0 top-full w-48 bg-white text-black uppercase rounded shadow-lg p-4 z-50">
                <div className="mb-2 text-gray-700 text-center">
                  <p className="font-semibold">Wallet Address:</p>
                  <p>{shortenAddress(walletAddress)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-400 hover:bg-blue-500 text-white w-full py-2 rounded cursor-pointer uppercase"
                >
                  logout
                </button>
              </div>
            )}
          </div>

          {/* 移动端菜单图标 */}
          <div className="lg:hidden ml-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <svg
                  className="text-black"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="text-black"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端菜单：仅在小屏幕且菜单展开时显示 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-30 md:top-25 left-0 w-full bg-white shadow-md z-40">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              href="/faucet"
              className="text-xl text-black hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              CERC20 Faucet
            </Link>
            <Link
              href="/balance"
              className="text-xl text-black hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              CERC20 Balance
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
