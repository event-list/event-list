import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { EventModel } from '@event-list/modules';
import type { GraphQLContext } from '@event-list/types';

import { eventField } from '../EventFields';
import { EventEdge } from '../EventType';

interface EventCreateArgs {
  title: string;
  description: string;
  label: string;
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
    label: {
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
  mutateAndGetPayload: async (args: EventCreateArgs, ctx: GraphQLContext) => {
    if (!ctx.user) throw new Error('Unauthorized');

    const titleAndLabel = `${args.title}-${args.label}`;

    const eventSlug = titleAndLabel.replace(' ', '-').toLowerCase();

    const rest = {
      published: true,
      slug: eventSlug,
    };

    const newEvent = await new EventModel({
      ...args,
      ...rest,
    }).save();

    if (!newEvent) throw new Error('Something went wrong');

    return {
      id: newEvent._id,
      success: 'Event successfully created',
    };
  },
  outputFields: {
    ...eventField(),
    ...successField,
    ...errorField,
  },
});
