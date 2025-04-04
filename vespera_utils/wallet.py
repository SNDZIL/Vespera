from datetime import datetime

def warp_explorer_url(address: str, 
                       explorer_api_key: str,
                       module: str="account",
                       action: str="balance",
                       chain_id: int=1,
                       use_aptos: bool=False):
    url_prefix = "https://api.explorer.io/v2/api?"
    if use_aptos:
        # the aptos testnet doesn't need chain_id parameter
        url_prefix = "https://api-aptos.explorer.io/api?"

    match action:
        case "balance":
            if use_aptos:
                return f"{url_prefix}module={module}&action={action}&address={address}&tag=latest&apikey={explorer_api_key}"
            else:
                return f"{url_prefix}chainid={chain_id}&module={module}&action={action}&address={address}&tag=latest&apikey={explorer_api_key}"
        
        case "txlist":
            if use_aptos:
                return f"{url_prefix}module={module}&action={action}&address={address}&startblock=0&endblock=99999999&sort=desc&apikey={explorer_api_key}"
            else:
                return f"{url_prefix}chainid={chain_id}&module={module}&action={action}&address={address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey={explorer_api_key}"
            
        case "txlistinternal":
            if use_aptos:
                return f"{url_prefix}module={module}&action={action}&address={address}&startblock=0&endblock=99999999&sort=desc&apikey={explorer_api_key}"
            else:
                return f"{url_prefix}chainid={chain_id}&module={module}&action={action}&address={address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey={explorer_api_key}"


def complete_explorer_aptos_url(url_prefix: str, 
                                    explorer_api_key: str,
                                    action: str,
                                    target_wallet_address: str,
                                    module: str="account",) -> str:
    match action:
        case "balance":
            return f"{url_prefix}module={module}&action={action}&address={target_wallet_address}&tag=latest&apikey={explorer_api_key}"
        
        case "txlist":
            return f"{url_prefix}module={module}&action={action}&address={target_wallet_address}&startblock=0&endblock=99999999&sort=desc&apikey={explorer_api_key}"
            
        case "txlistinternal":
            return f"{url_prefix}module={module}&action={action}&address={target_wallet_address}&startblock=0&endblock=99999999&sort=desc&apikey={explorer_api_key}"

def get_tx_brief(tx: dict, wallet_address: str) -> dict:
    timestamp = datetime.fromtimestamp(int(tx.get('timeStamp')))
    amount = f"{amount:.7f}"
    # print(int(tx.get('value')))
    from_wallet = tx.get('from')
    from_wallet = from_wallet.lower()
    to_wallet = tx.get('to')
    to_wallet = to_wallet.lower()
    tx_info = {
        "worldtime": timestamp,
        "amount": f"{amount} APT",
        "from_wallet": from_wallet,
        "to_wallet": to_wallet,
    }
    if to_wallet == wallet_address:
        tx_info["type"] = "in"
    elif from_wallet == wallet_address:
        tx_info["type"] = "out"
    return tx_info