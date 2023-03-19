import UserModel from '../UserModel';

type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
  gender: string;
};

const createUser = async (payload: CreateUserPayload) => {
  return new UserModel(payload).save();
};

export { createUser };
export type { CreateUserPayload };
