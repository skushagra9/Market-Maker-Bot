import { ethers } from "ethers";
import dotenv from 'dotenv';
import DEPOSIOTABI from './abi/deposit.json';
dotenv.config();

export const getPortfolioBalance = async (address: string): Promise<string> => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS as `0x${string}`,
      DEPOSIOTABI['abi'],
      provider
    );
    const balance = await contract.balances(address);
    const formattedBalance = ethers.utils.formatUnits(balance, 6);
    return formattedBalance;
  } catch (error) {
    console.error('Error fetching portfolio balance:', error);
    throw error;
  }
};

export const checkBalance = async (address: string) => {
  const balance = await getPortfolioBalance(address);
  console.log(`Balance for ${address}: ${balance}`);

  let count = 0;
  let remainingBalance = Number(balance);

  while (remainingBalance >= 40) {
    remainingBalance -= 40;
    count++;
  }
  return { count, remainingBalance };
};

