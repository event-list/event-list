import { UserMeUpdateMutation } from './mutations/UserMeUpdateMutation';
import { UserSignInMutation } from './mutations/UserSignInMutation';
import { UserSignOutMutation } from './mutations/UserSignOutMutation';
import { UserSignUpMutation } from './mutations/UserSignUpMutation';

const UserMutations = {
  UserSignUpMutation,
  UserSignInMutation,
  UserSignOutMutation,
  UserMeUpdateMutation,
};

export { UserMutations };
