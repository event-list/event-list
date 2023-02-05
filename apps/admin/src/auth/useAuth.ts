import { graphql, useFragment } from 'react-relay';

import type { useAuthFragment_user$key } from '../../__generated__/useAuthFragment_user.graphql';

const useAuthFragment = graphql`
  fragment useAuthFragment_user on Merchant {
    name
  }
`;

export const useAuth = (fragmentKey: useAuthFragment_user$key) => {
  const merchant = useFragment<useAuthFragment_user$key>(useAuthFragment, fragmentKey);

  return [merchant];
};
