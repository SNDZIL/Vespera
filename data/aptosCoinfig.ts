import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
 
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);
export const ADDRESS = "0x4721a2f2a0ee8239054241dfba5aa29caba0fb9b064566a0b9d2d2a9aa7bb69f"
export const MODULE = "lend"

export const ConfigAddress = "0xbbb23329339d042c543566a9fe3ca5c35e775b5e6518d585e5bfcfae4524ec2e"
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

