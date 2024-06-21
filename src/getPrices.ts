export async function getCryptoPrices(asset:string) {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const prices = {
            BTC: data.bitcoin.usd,
            ETH: data.ethereum.usd,
            SOL: data.solana.usd
        };
        
        console.log(prices);
      if(asset === 'BTC') {
return prices.BTC
    }
    else if(asset === 'ETH') {
      return prices.ETH
    }
    else if(asset === 'SOL') {
      return prices.SOL
    }
    else{
      return "not found"
    }
    } catch (error) {
        console.error('Error fetching the crypto prices:', error);
    }
}
