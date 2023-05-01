import { graphql } from 'relay-runtime';

export const ShareEvent = graphql`
  mutation ShareEventMutation($input: CreateEventMutationInput!, $connections: [ID!]!) {
    CreateEventMutation(input: $input) {
      myEventsEdge @prependEdge(connections: $connections) {
        cursor
        node {
          ...EventRowFragment_event
        }
      }
      success
      error
    }
  }
`;
