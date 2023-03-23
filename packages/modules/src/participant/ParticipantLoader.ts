import { createLoader } from '@entria/graphql-mongo-helpers';

import ParticipantModel from './ParticipantModel';

const {
  Wrapper: ParticipantLoader,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: ParticipantModel,
  loaderName: 'ParticipantLoader',
});

export { getLoader, clearCache, load, loadAll };
export default ParticipantLoader;
