import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
 
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);
export const ADDRESS = "0x6e119506e14f076333557500d3d1025b63f757c570abee35b1f9dcb1514cff0a"
export const MODULE = "lend"

export const ConfigAddress = "0xbbb23329339d042c543566a9fe3ca5c35e775b5e6518d585e5bfcfae4524ec2e"
export const CoffeeAddress = "0xf87d46de310897a1a34abab457e7ce3395a3e9a7cff4db0e7ca744440a2d7007"
export const CoffeeProfile = "0xc30085faedf674462f02e0fda13f6491612d26629e7df9f572f7f9e7f4c22b52"

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

