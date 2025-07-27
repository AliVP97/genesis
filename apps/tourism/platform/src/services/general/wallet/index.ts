import request from 'services/axios';
import { WalletAmountRes } from './interface';

export const getWalletAmount = async () => {
  const { data }: { data: WalletAmountRes } = await request.get('/wallet/v1/wallet');
  return data;
};
