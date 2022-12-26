import { GraphQLObjectType, GraphQLString } from 'graphql'

import { GraphQLContext } from '../../graphql/context'
import { FieldError } from '../../utils/fieldError'

const FieldErrorType = new GraphQLObjectType<FieldError, GraphQLContext>({
  name: 'FieldError',
  description: 'An object containing an error message and the field the error belongs to',
  fields: () => ({
    field: {
      type: GraphQLString,
      resolve: ({ field }) => field
    },
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message
    }
  })
})

export { FieldErrorType }
