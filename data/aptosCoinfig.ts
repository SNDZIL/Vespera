import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
 
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);
export const ADDRESS = "0x060a67a4474353252bf06989d00e96b55f5d18f44554e6a8323afb4b94ae5e15"
export const MODULE = "lend"

export const ConfigAddress = "0xec1d87f61881c45f7252a4c519e8486c1c530571d26245758a78ea8ca662a17e"
export const CoffeeAddress = "0x376fba087c1103d3378ec9f73cd3302ed56111b2d7721b864985637ad8a5bd23"
export const CoffeeProfile = "0x54da9d25ff0772524ff18bdba4351ddba425ca4ef7ebcead9bc55878e93bf23"

export const getMacCredit = async(address: string)=>{
  const payload = {
    function: `${ConfigAddress}::${MODULE}::viewMax`,
    arguments: [address],
  };
   
  const maxCredit = (await aptos.view({ payload }))[0];
  return maxCredit;
}

export const gerCurrentCredit = async(address: string)=>{
  const payload = {
    function: `${ConfigAddress}::${MODULE}::viewCurrent`,
    arguments: [address],
  };
  const currentCredit = (await aptos.view({ payload }))[0];
  return currentCredit;
}

