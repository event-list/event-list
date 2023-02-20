import { graphql } from 'relay-runtime';

export const EnsurePresence = graphql`
  mutation EnsurePresenceMutation($input: EnsurePresenceMutationInput!) {
    EnsurePresenceMutation(input: $input) {
      success
      error
    }
  }
`;
