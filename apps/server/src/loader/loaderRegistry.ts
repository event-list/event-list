import { getLoaderRegistry } from '@event-list/graphql';

import { UserLoader, EventLoader } from '@event-list/modules';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);
registerLoader('EventLoader', EventLoader.getLoader);

export { getDataloaders, registerLoader };
