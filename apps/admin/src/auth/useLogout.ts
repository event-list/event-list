import { useRouter } from 'next/router';
import { useCallback } from 'react';
import type { UseMutationConfig } from 'react-relay';
import { useMutation } from 'react-relay';

import type { SignOutMutation } from '../../__generated__/SignOutMutation.graphql';
import { SignOut } from '../components/sign-out/SignOutMutation';

export const useLogout = () => {
  const router = useRouter();

  const [handleLogout] = useMutation<SignOutMutation>(SignOut);

  const logout = useCallback(() => {
    const config: UseMutationConfig<SignOutMutation> = {
      variables: {
        input: {},
      },
    };

    handleLogout(config);

    router.push('/sign-in');
  }, [router]);

  return [logout];
};
