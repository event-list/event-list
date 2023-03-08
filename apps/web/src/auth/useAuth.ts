import { graphql } from 'react-relay';

export const useAuthFragment = graphql`
  fragment useAuthFragment_user on User {
    name
    gender
    email
  }
`;
