import { successField } from '@entria/graphql-mongo-helpers'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { generateToken, setAuthCookie } from '../../../auth'
import { GraphQLContext } from '../../../graphql/context'
import { fieldError } from '../../../utils/fieldError'
import { NewUserArgs, validateAndSanitizeNewUser } from '../../../utils/requests/newUser'
import { FieldErrorField } from '../../field-error/FieldErrorField'
import * as UserLoader from '../UserLoader'
import { UserModel } from '../UserModel'
import { UserType } from '../UserType'

type UserSignUpMutationArgs = NewUserArgs

const UserSignUpMutation = mutationWithClientMutationId({
  name: 'UserSignUpMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    gender: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async (args: UserSignUpMutationArgs, ctx: GraphQLContext) => {
    const { name, email, password, gender, error } = validateAndSanitizeNewUser(args)

    if (error) return error

    const isEmailInUse = await UserModel.exists({ email })

    if (isEmailInUse) return fieldError('email', 'Email Already in Use')

    const user = await new UserModel({
      name,
      email,
      password,
      gender
    }).save()

    const token = generateToken(user)

    setAuthCookie(ctx.ctx, user)

    return {
      token,
      id: user._id,
      success: 'User successfully signed up'
    }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: async ({ id }, _, ctx) => {
        return UserLoader.load(ctx, id)
      }
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token
    },
    ...successField,
    ...FieldErrorField
  }
})

export { UserSignUpMutation }
