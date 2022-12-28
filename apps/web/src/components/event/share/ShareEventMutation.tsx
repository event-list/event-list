import { graphql } from 'relay-runtime';

export const ShareEvent = graphql`
  mutation ShareEventMutation($input: CreateEventMutationInput!) {
    CreateEventMutation(input: $input) {
      events {
        edges {
          node {
            id
            title
            description
            slug
            flyer
            label
            published
            date
            eventOpenAt
            eventEndAt
            listAvailableAt
            classification
            price
          }
          cursor
        }
      }
      success
      error
    }
  }
`;
