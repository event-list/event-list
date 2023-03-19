import MerchantModel from '../MerchantModel';

type CreateMerchantPayload = {
  email: string;
  name: string;
  description: string;
  logo: string;
  password: string;
  phoneNumber: string;
  // cnpj: ITaxID;
};

const createMerchant = async (payload: CreateMerchantPayload) => {
  return new MerchantModel(payload).save();
};

export { createMerchant };
export type { CreateMerchantPayload };
