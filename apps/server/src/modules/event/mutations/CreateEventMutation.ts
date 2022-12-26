import { successField } from '@entria/graphql-mongo-helpers'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay'
import { GraphQLContext } from '../../../graphql/context'
import { FieldErrorField } from '../../field-error/FieldErrorField'
import * as EventLoader from '../EventLoader'
import { EventModel } from '../EventModel'
import { EventEdge } from '../EventType'

interface EventCreateArgs {
  title: string
  description: string
  label: string
  flyer: string
  date: string
  eventOpenAt: string
  eventEndAt: string
  listAvailableAt: string
  classification: string
  price: string
}

export const CreateEventMutation = mutationWithClientMutationId({
  name: 'CreateEventMutation',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    label: {
      type: new GraphQLNonNull(GraphQLString)
    },
    flyer: {
      type: new GraphQLNonNull(GraphQLString)
    },
    date: {
      type: new GraphQLNonNull(GraphQLString)
    },
    eventOpenAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    eventEndAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    listAvailableAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    classification: {
      type: new GraphQLNonNull(GraphQLString)
    },
    price: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async (args: EventCreateArgs, ctx: GraphQLContext) => {
    if (!ctx.user) throw new Error('Unauthorized')

    const titleAndLabel = `${args.title}-${args.label}`
    const eventSlug = titleAndLabel.replace(' ', '-').toLowerCase()
    const rest = {
      published: true,
      slug: eventSlug
    }

    const newEvent = await new EventModel({
      ...args,
      ...rest
    }).save()

    if (!newEvent) throw new Error('Something went wrong')

    return {
      id: newEvent._id,
      success: 'Event successfully created'
    }
  },
  outputFields: {
    eventEdge: {
      type: EventEdge,
      resolve: async ({ id }, _, ctx) => {
        const event = await EventLoader.load(ctx, id)

        if (!event) return {}

        return {
          cursor: toGlobalId('Event', event._id),
          node: event
        }
      }
    },
    ...successField,
    ...FieldErrorField
  }
})
