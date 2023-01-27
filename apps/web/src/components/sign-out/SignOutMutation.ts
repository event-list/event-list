import { graphql } from 'react-relay';

export const SignOut = graphql`
  mutation SignOutMutation($input: UserSignOutMutationInput!) {
    UserSignOutMutation(input: $input) {
      error
      success
    }
  }
`;
