import { graphql } from 'relay-runtime';

export const EnsurePresence = graphql`
  mutation EnsurePresenceMutation($input: EventEnsurePresenceMutationInput!) {
    EventEnsurePresenceMutation(input: $input) {
      success
      error
    }
  }
`;
