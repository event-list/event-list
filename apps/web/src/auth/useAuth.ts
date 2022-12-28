import { graphql, readInlineData, useFragment } from 'react-relay';
import { useAuthFragment_user$key } from '../../__generated__/useAuthFragment_user.graphql';

const useAuthFragment = graphql`
  fragment useAuthFragment_user on User {
    name
  }
`;

export const useAuth = (fragmentKey: useAuthFragment_user$key) => {
  const user = useFragment<useAuthFragment_user$key>(
    useAuthFragment,
    fragmentKey
  );

  return [user];
};
