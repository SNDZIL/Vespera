"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast"; // 引入 Toast 组件
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function FaucetPage() {
  const { account, connected, disconnect, wallet } = useWallet();
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFaucet = async () => {
    if (isLoading) return;

    // 如果用户未输入地址，提示错误信息
    if (!userAddress.trim()) {
      toast.error("Please enter your wallet address.");
      return;
    }

    setIsLoading(true);
    setResult("Processing, please wait...");
    console.log("Registered successfully for: ", userAddress);

    try {
      await axios.post(
        "http://localhost:3333/faucet",
        { address: userAddress },
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(`Tokens were successfully sent to [${userAddress}].`);
      toast.success("Tokens sent successfully!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Axios error:", error.response?.data || error.message);
      setResult(`${error.response?.data?.message || "Failed to send tokens."}`);
      toast.error(error.response?.data?.message || "Failed to send tokens.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6 lg:py-8">
      <Toaster />
      {/* 左侧 Faucet 区域 */}
      <div className="bg-white lg:p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Register as a Merchant</h2>
        <p className="mt-2 text-gray-600">Become a merchant for free.</p>

        {/* Input Address */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Your address
          </label>
          <input
            type="text"
            placeholder="Wallet address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          {/* <p className="mt-1 text-gray-500 text-sm">
            Limit: One request per address per 24 hours.
          </p> */}
        </div>

        {/* 领取按钮 */}
        <button
          onClick={handleFaucet}
          disabled={isLoading}
          className={`mt-6 w-full text-lg font-semibold p-3 rounded-lg transition-all duration-200 border-2 ${
            isLoading
              ? "bg-gray-400 text-blue-50 cursor-not-allowed border-gray-400"
              : "text-blue-500 bg-transparent border-blue-400 hover:bg-blue-400 hover:text-white cursor-pointer"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              {/* Tailwind CSS Spinner */}
              <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            "Register"
          )}
        </button>

        {result && (
          <div className="break-words">
            <p className="mt-4 text-blue-500 font-semibold text-sm whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}

        {/* About Vespera */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">About Vespera</h2>
          <ul className="mt-4 list-disc list-inside text-gray-700">
            <li>
              Each wallet can request to become a merchant once per month.
            </li>
            <li>
              Once becoming a merchant, you will receive a credit score based on
              your transaction history.
            </li>
            <li>The credit score will be updated automatically.</li>
          </ul>
        </section>
      </div>

      {/* 右侧 Frequently Asked Questions */}
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

        {/* FAQ 列表 */}
        <div className="mt-6">
          {[
            {
              question: "What is Vespera?",
              answer:
                "Vespera is an innovative payment method designed to provide users with a more flexible and convenient shopping experience while offering merchants a novel mode of collection.",
            },
            {
              question: "How to bacome a merchant?",
              answer:
                "Users can register as merchants on this page. Simply fill out the form with your wallet address, and we will verify your credentials.",
            },
            {
              question: "What Vespera can do for merchants?",
              answer:
                "Vespera enables merchants to diversify their payment collection methods, manage cash flow more effectively, and engage with a broader market while maintaining a secure and automated repayment process.",
            },
            {
              question: "What kind of tokens are supported now?",
              answer:
                "Our platform currently supports VES Coin(a stable coin). Please refer to our documentation for the most up-to-date list of supported tokens.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button
                className="flex justify-between w-full text-lg font-semibold text-gray-700 hover:text-blue-400 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openFAQ === index ? "-" : "+"}</span>
              </button>
              {openFAQ === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
