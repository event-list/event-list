import { graphql, useFragment } from 'react-relay';

import type { useAuthFragment_user$key } from '../../__generated__/useAuthFragment_user.graphql';

export const useAuthFragment = graphql`
  fragment useAuthFragment_user on User {
    name
    gender
    email
  }
`;

export const useAuth = (fragmentKey: useAuthFragment_user$key) => {
  const user = useFragment<useAuthFragment_user$key>(useAuthFragment, fragmentKey);

  return [user];
};
