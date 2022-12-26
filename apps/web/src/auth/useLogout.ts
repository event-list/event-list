import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useMutation, UseMutationConfig } from 'react-relay'
import { SignOut } from '../components/sign-out/SignOutMutation'
import { SignOutMutation } from '../../__generated__/SignOutMutation.graphql'

export const useLogout = () => {
  const router = useRouter()

  const [handleLogout] = useMutation<SignOutMutation>(SignOut)

  const logout = useCallback(() => {
    const config: UseMutationConfig<SignOutMutation> = {
      variables: {
        input: {}
      }
    }

    handleLogout(config)

    router.push('/sign-in')
  }, [router])

  return [logout]
}
