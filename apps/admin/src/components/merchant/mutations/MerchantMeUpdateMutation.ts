import { graphql } from 'relay-runtime';

export const MerchantMeUpdate = graphql`
  mutation MerchantMeUpdateMutation($input: MerchantMeUpdateMutationInput!) {
    MerchantMeUpdateMutation(input: $input) {
      success
      error
    }
  }
`;
