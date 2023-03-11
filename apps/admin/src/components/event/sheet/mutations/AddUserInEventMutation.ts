import { graphql } from 'relay-runtime';

export const AddUserInEvent = graphql`
  mutation AddUserInEventMutation($input: AddUserInEventMutationInput!) {
    AddUserInEventMutation(input: $input) {
      success
      error
    }
  }
`;
