import { graphql } from 'relay-runtime';

export const AddParticipantInEvent = graphql`
  mutation AddParticipantInEventMutation($input: AddParticipantInEventMutationInput!) {
    AddParticipantInEventMutation(input: $input) {
      success
      error
    }
  }
`;
