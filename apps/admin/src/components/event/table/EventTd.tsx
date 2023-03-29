import { Td } from '@chakra-ui/react';

const EventTd = ({ children, event }) => <Td color={event.published ? 'white' : 'grey'}>{children}</Td>;

export { EventTd };
