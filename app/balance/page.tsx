"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { shortenAddress } from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function BalancePage() {
  const [userAddress, setUserAddress] = useState<string>("");
  const [jwtToken, setJwtToken] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [fullBalance, setFullBalance] = useState<string>("");
  const [halfBalance, setHalfBalance] = useState<string>("");
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [isFullDecryptLoading, setIsFullDecryptLoading] = useState(false);
  const [isHalfDecryptLoading, setIsHalfDecryptLoading] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  useEffect(() => {
    const updateWalletInfo = () => {
      const storedAddress = localStorage.getItem("walletAddress") || "";
      const storedJwt = localStorage.getItem("jwt") || "";
      setUserAddress(storedAddress);
      setJwtToken(storedJwt);
    };

    updateWalletInfo();
    window.addEventListener("walletChanged", updateWalletInfo);
    return () => {
      window.removeEventListener("walletChanged", updateWalletInfo);
    };
  }, []);

  /** 获取普通余额 */
  const handleCheckBalance = useCallback(async () => {
    console.log("Fetching balance for address:", userAddress);
    try {
      const response = await axios.get(
        "http://localhost:3333/decrypt/getbalance",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setBalance(`${String(response.data)}`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error(
        "Axios error (balance):",
        error.response?.data || error.message
      );
      setBalance(
        `${error.response?.data?.message || "Error fetching balance."}`
      );
      toast.error(error.response?.data?.message || "Error fetching balance.");
    }
  }, [userAddress, jwtToken]);
  
  useEffect(() => {
    if (userAddress && jwtToken) {
      handleCheckBalance();
      setFullBalance("");
      setHalfBalance("");
    }
  }, [userAddress, jwtToken, handleCheckBalance]);

  /** 全部解密 */
  const handleCheckFullBalance = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (isFullDecryptLoading) return;
    setIsFullDecryptLoading(true);
    console.log("Decrypt full balance for address:", userAddress);
    try {
      const response = await axios.post(
        "http://localhost:3333/decrypt/fullydecrypt",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setFullBalance(`${String(response.data)}`);
      toast.success("Full Decrypt successful!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error(
        "Axios error (full):",
        error.response?.data || error.message
      );
      setFullBalance(
        `${error.response?.data?.message || "Error decrypting tokens."}`
      );
      toast.error(error.response?.data?.message || "Error decrypting tokens.");
    } finally {
      setIsFullDecryptLoading(false);
    }
  };

  /** 部分解密 */
  const handleCheckHalfBalance = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (isHalfDecryptLoading) return;
    setIsHalfDecryptLoading(true);
    console.log("Decrypt half balance for address:", userAddress);
    try {
      const response = await axios.post(
        "http://localhost:3333/decrypt/halfdecrypt",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setHalfBalance(`${String(response.data)}`);
      toast.success("Half Decrypt successful!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error(
        "Axios error (half):",
        error.response?.data || error.message
      );
      setHalfBalance(
        `${error.response?.data?.message || "Error decrypting tokens."}`
      );
      toast.error(error.response?.data?.message || "Error decrypting tokens.");
    } finally {
      setIsHalfDecryptLoading(false);
    }
  };

  return (
    <section className="py-6 md:mt-10 lg:mt-16">
      <Toaster />
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-24 gap-y-10">
          {/* 左侧 - 余额信息 */}
          <div>
            <h2 className="text-3xl font-bold text-black">CERC20 Balance</h2>
            <p className="mt-2 text-gray-600">
              Check your token balance or decrypt it.
            </p>

            {!userAddress && (
              <div className="mt-12 p-4 bg-white rounded-lg  break-words">
                <p className="text-lg font-semibold text-gray-800">
                  Please connect your wallet first to check the balance.
                </p>
              </div>
            )}

            {userAddress && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md break-words flex items-center justify-between">
                <div>
                  <div className="flex">
                    <p className="text-lg font-semibold text-gray-800">
                      Wallet Address:
                    </p>
                    <button
                      onClick={() => setShowFullAddress(!showFullAddress)}
                      className="ml-4 text-gray-600 hover:text-black transition"
                    >
                      {showFullAddress ? (
                        /* 眼睛关闭图标 */
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      ) : (
                        /* 眼睛打开图标 */
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-gray-600">
                    {showFullAddress
                      ? userAddress
                      : shortenAddress(userAddress)}
                  </p>
                </div>
              </div>
            )}

            {userAddress && balance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md break-words">
                <p className="text-lg font-semibold text-gray-800">
                  Encrypted Balance:
                </p>
                <p className="text-sm font-mono text-gray-600">{balance}</p>
              </div>
            )}

            {/* 显示解密结果 */}
            {userAddress && fullBalance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md break-words">
                <p className="text-lg font-semibold text-gray-800">
                  Decrypted Balance:
                </p>
                <p className="text-sm font-mono text-gray-600">{fullBalance}</p>
              </div>
            )}

            {userAddress && halfBalance && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md break-words">
                <p className="text-lg font-semibold text-gray-800">
                  Approximate Decrypted Balance:
                </p>
                <p className="text-sm font-mono text-gray-600">{halfBalance}</p>
              </div>
            )}
          </div>

          {/* 右侧 - 解密按钮和介绍 */}
          <div className=" bg-white rounded-lg">
            <div className="p-8 lg:px-12 lg:py-10">
              <h3 className="text-2xl font-semibold text-black">
                Decrypt Balance
              </h3>

              {/* Full Decrypt 按钮及问号悬浮提示 */}
              <div className="relative mt-6 flex items-center">
                <button
                  onClick={handleCheckFullBalance}
                  disabled={isFullDecryptLoading}
                  className={`flex items-center justify-center w-full px-4 py-4 text-base font-semibold transition-all duration-200 border-2 rounded-md ${
                    isFullDecryptLoading
                      ? "bg-gray-400 text-blue-50 cursor-not-allowed border-gray-400"
                      : "text-blue-500 bg-transparent border-blue-400 hover:bg-blue-400 hover:text-white cursor-pointer"
                  }`}
                >
                  {isFullDecryptLoading ? (
                    <div className="flex items-center justify-center">
                      {/* Tailwind CSS Spinner */}
                      <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Decrypt"
                  )}
                </button>

                {/* 问号图标 */}
                <span
                  className="absolute right-0 top-0 cursor-pointer"
                  onMouseEnter={() => setHoveredTooltip("full")}
                  onMouseLeave={() => setHoveredTooltip(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6 text-blue-700"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                  {hoveredTooltip === "full" && (
                    <div className="absolute right-1/2 lg:left-full top-1/2 transform -translate-y-1/2 w-64 bg-gray-800 text-blue-50 text-sm p-3 rounded-md shadow-lg">
                      <strong>Exact Decrypt:</strong> Fully decrypts your data
                      to display your precise token balance.
                    </div>
                  )}
                </span>
              </div>

              {/* Half Decrypt 按钮及问号悬浮提示 */}
              <div className="relative mt-6">
                <button
                  onClick={handleCheckHalfBalance}
                  disabled={isHalfDecryptLoading}
                  className={`flex items-center justify-center w-full px-4 py-4 text-base font-semibold transition-all duration-200 border-2 rounded-md ${
                    isHalfDecryptLoading
                      ? "bg-gray-400 text-blue-50 cursor-not-allowed border-gray-400"
                      : "text-blue-500 bg-transparent border-blue-400 hover:bg-blue-400 hover:text-white cursor-pointer"
                  }`}
                >
                  {isHalfDecryptLoading ? (
                    <div className="flex items-center justify-center">
                      {/* Tailwind CSS Spinner */}
                      <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Approximate Decrypt"
                  )}
                </button>

                {/* 问号图标 */}
                <span
                  className="absolute right-0 top-0 cursor-pointer"
                  onMouseEnter={() => setHoveredTooltip("half")}
                  onMouseLeave={() => setHoveredTooltip(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6 text-blue-700"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>

                  {hoveredTooltip === "half" && (
                    <div className="absolute right-1/2 lg:left-full top-1/2 transform -translate-y-1/2 w-64 bg-gray-800 text-blue-50 text-sm p-3 rounded-md shadow-lg">
                      <strong>Approximate Decrypt:</strong> Reveals only an
                      estimated range of your token balance to protect your
                      privacy.
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
