import { graphql } from 'relay-runtime';

export const UpdateEvent = graphql`
  mutation UpdateEventMutation($input: UpdateEventMutationInput!) {
    UpdateEventMutation(input: $input) {
      success
      error
    }
  }
`;
