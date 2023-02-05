import { graphql } from 'relay-runtime';

export const SignUp = graphql`
  mutation SignUpMutation($input: MerchantSignUpMutationInput!) {
    MerchantSignUpMutation(input: $input) {
      success
      error
    }
  }
`;
