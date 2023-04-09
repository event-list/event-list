import { errorField, successField } from '@entria/graphql-mongo-helpers';
import { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import type { Date } from 'mongoose';

import type { IBatch } from '@event-list/modules';
import { eventField, handleCreateEvent } from '@event-list/modules';

type EventCreateArgs = {
  title: string;
  description: string;
  place: string;
  flyer: string;
  dateStart: Date;
  dateEnd: Date;
  listAvailableAt: Date;
  classification: string;
  batches: IBatch[];
  private?: boolean;
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
    batches: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLInputObjectType({
            name: 'batchesCreate',
            fields: {
              title: {
                type: new GraphQLNonNull(GraphQLString),
              },
              value: {
                type: new GraphQLNonNull(GraphQLString),
              },
              date: {
                type: new GraphQLNonNull(GraphQLString),
              },
              visible: {
                type: GraphQLBoolean,
              },
            },
          }),
        ),
      ),
    },
    private: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args: EventCreateArgs, ctx) => {
    const { merchant, t } = ctx;

    if (!merchant) return { id: null, success: null, error: t('Unauthorized') };

    const { event, error } = await handleCreateEvent({
      payload: { merchantId: merchant._id, ...args },
      context: ctx,
    });

    if (!event) {
      return {
        id: null,
        success: null,
        error,
      };
    }

    return {
      id: event._id,
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
