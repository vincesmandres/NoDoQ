"use client";

import { SuiClientProvider, createNetworkConfig, WalletProvider as SuiWalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet:  { url: "https://fullnode.testnet.sui.io" },
  localnet: { url: "http://127.0.0.1:9000" },
  mainnet:  { url: "https://fullnode.mainnet.sui.io" },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <SuiWalletProvider>{children}</SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}