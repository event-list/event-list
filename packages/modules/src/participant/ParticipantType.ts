import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { EventType, ParticipantLoader } from '@event-list/modules';

import { nodeInterface, registerTypeLoader } from '../node/typeRegister';

const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  description: 'Participant Type',
  fields: () => ({
    id: globalIdField('Participant'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (participant) => participant.name,
    },
    event: {
      type: new GraphQLNonNull(EventType),
      resolve: (participant) => participant.event,
    },
    batch: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (participant) => participant.batch.title,
    },
  }),
  interfaces: () => [nodeInterface],
});

registerTypeLoader(ParticipantType, ParticipantLoader.load);

const { connectionType: ParticipantConnection, edgeType: ParticipantEdge } = connectionDefinitions({
  name: 'Participant',
  nodeType: ParticipantType,
});

export { ParticipantConnection, ParticipantEdge, ParticipantType };
