import { graphql } from 'relay-runtime';

export const UserMeUpdate = graphql`
  mutation UserMeUpdateMutation($input: UserMeUpdateMutationInput!) {
    UserMeUpdateMutation(input: $input) {
      success
      error
    }
  }
`;
