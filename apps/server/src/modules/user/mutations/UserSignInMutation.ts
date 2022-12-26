import { successField } from '@entria/graphql-mongo-helpers'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { setAuthCookie } from '../../../auth'
import { GraphQLContext } from '../../../graphql/context'
import { fieldError } from '../../../utils/fieldError'
import { FieldErrorField } from '../../field-error/FieldErrorField'
import * as UserLoader from '../UserLoader'
import { UserModel } from '../UserModel'
import { UserType } from '../UserType'

interface UserSignInMutationArgs {
  email: string
  password: string
}

const UserSignInMutation = mutationWithClientMutationId({
  name: 'UserSignInMutation',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async (args: UserSignInMutationArgs, ctx: GraphQLContext) => {
    const { email, password } = {
      password: args.password.trim(),
      email: args.email.trim().toLowerCase()
    }

    const user = await UserModel.findOne({ email })

    if (!user) return fieldError('email', 'User not found')

    const isPasswordCorrect = user.authenticate(password)

    if (!isPasswordCorrect) return fieldError('password', 'Wrong password')

    setAuthCookie(ctx.ctx, user)

    return {
      id: user._id,
      success: 'User successfully signed in'
    }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ id }, _, ctx) => {
        return UserLoader.load(ctx, id)
      }
    },
    ...successField,
    ...FieldErrorField
  }
})

export { UserSignInMutation }
