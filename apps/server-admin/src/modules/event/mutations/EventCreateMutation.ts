import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { eventField, EventModel } from '@event-list/modules';

interface EventCreateArgs {
  title: string;
  description: string;
  place: string;
  flyer: string;
  date: string;
  eventOpenAt: string;
  eventEndAt: string;
  listAvailableAt: string;
  classification: string;
  price: string;
}

export const EventCreateMutation = mutationWithClientMutationId({
  name: 'CreateEventMutation',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    place: {
      type: new GraphQLNonNull(GraphQLString),
    },
    flyer: {
      type: new GraphQLNonNull(GraphQLString),
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventOpenAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventEndAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    listAvailableAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    classification: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: EventCreateArgs, ctx) => {
    const { merchant, t } = ctx;
    if (!merchant) throw new Error('Unauthorized');

    const eventSlug = args.title;

    const rest = {
      published: true,
      label: merchant._id,
      slug: eventSlug,
    };

    const newEvent = await new EventModel({
      ...args,
      ...rest,
    }).save();

    if (!newEvent) {
      return {
        id: null,
        success: null,
        error: t('Something went wrong'),
      };
    }

    return {
      id: newEvent._id,
      success: t('Event successfully created'),
      error: null,
    };
  },
  outputFields: {
    ...eventField(),
    ...successField,
    ...errorField,
  },
});
