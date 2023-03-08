import { graphql } from 'relay-runtime';

export const ShareEvent = graphql`
  mutation ShareEventMutation($input: CreateEventMutationInput!) {
    CreateEventMutation(input: $input) {
      success
      error
    }
  }
`;
