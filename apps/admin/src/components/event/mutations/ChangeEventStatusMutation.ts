import { graphql } from 'relay-runtime';

export const ChangeEventStatus = graphql`
  mutation ChangeEventStatusMutation($input: ChangeEventStatusMutationInput!) {
    ChangeEventStatusMutation(input: $input) {
      success
      error
    }
  }
`;
