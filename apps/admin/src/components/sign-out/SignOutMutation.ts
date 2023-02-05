import { graphql } from 'react-relay';

export const SignOut = graphql`
  mutation SignOutMutation($input: MerchantSignOutMutationInput!) {
    MerchantSignOutMutation(input: $input) {
      error
      success
    }
  }
`;
