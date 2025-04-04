"use client"

import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// Internal components
// import { useToast } from "@/components/ui/use-toast";
import toast from "react-hot-toast";

// Internal constants
import { NETWORK } from "../constants";

export function WalletProvider({ children }: PropsWithChildren) {
//   const { toast } = useToast();

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: NETWORK}}
      onError={(error) => {
        toast.error(error || "Unknown wallet error");
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
