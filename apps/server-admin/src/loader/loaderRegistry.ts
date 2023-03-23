import { getLoaderRegistry } from '@event-list/graphql';
import { EventLoader, MerchantLoader, ParticipantLoader, UserLoader } from '@event-list/modules';

const { registerLoader, getDataloaders } = getLoaderRegistry();

registerLoader('UserLoader', UserLoader.getLoader);
registerLoader('EventLoader', EventLoader.getLoader);
registerLoader('MerchantLoader', MerchantLoader.getLoader);
registerLoader('ParticipantLoader', ParticipantLoader.getLoader);

export { getDataloaders, registerLoader };
