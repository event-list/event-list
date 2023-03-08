import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { eventField, EventModel } from '@event-list/modules';

type EventCreateArgs = {
  title: string;
  description: string;
  place: string;
  flyer: string;
  dateStart: Date;
  dateEnd: Date;
  listAvailableAt: Date;
  classification: string;
  price: string;
};

export const CreateEventMutation = mutationWithClientMutationId({
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
    dateStart: {
      type: new GraphQLNonNull(GraphQLString),
    },
    dateEnd: {
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

    if (!merchant) return { id: null, success: null, error: t('Unauthorized') };

    const rest = {
      status: true,
      label: merchant._id,
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
