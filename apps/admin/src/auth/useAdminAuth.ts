import { graphql } from 'react-relay';

export const useAdminAuthFragment = graphql`
  fragment useAdminAuthFragment_user on Merchant {
    name
    email
    description
    logo
    biography
    features
    facebookAccount
    instagramAccount
    phoneNumber
    twitterAccount
    website
  }
`;
