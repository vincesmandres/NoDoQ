"use client";
import { ConnectButton } from "@mysten/dapp-kit";

export default function Nav(){
  return (
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center", padding:"16px 24px"}}>
      <div style={{fontWeight:700}}>NoDoQ</div>
      <ConnectButton />
    </header>
  );
}
