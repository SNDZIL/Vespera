import { Network } from "@aptos-labs/wallet-adapter-react";

export const NETWORK = process.env.NETWORK as Network ?? "testnet";
export const MODULE_ADDRESS = process.env.MODULE_ADDRESS;
