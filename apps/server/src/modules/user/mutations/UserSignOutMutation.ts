import { errorField, successField } from '@entria/graphql-mongo-helpers'
import { mutationWithClientMutationId } from 'graphql-relay'
import { setAuthCookie } from '../../../auth'

const UserSignOutMutation = mutationWithClientMutationId({
  name: 'UserSignOutMutation',
  inputFields: {},
  mutateAndGetPayload: async (_, ctx) => {
    setAuthCookie(ctx.ctx, null)

    return {
      error: null,
      success: 'Sign Out successful'
    }
  },
  outputFields: {
    ...successField,
    ...errorField
  }
})

export { UserSignOutMutation }
