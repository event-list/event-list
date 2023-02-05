import { createLoader } from '@entria/graphql-mongo-helpers';

import UserModel from './UserModel';

const {
  Wrapper: UserLoader,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: UserModel,
  loaderName: 'UserLoader',
});

export { getLoader, clearCache, load, loadAll };
export default UserLoader;
