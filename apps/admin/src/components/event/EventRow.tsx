import { Tr, Td } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import timestampToDate from 'timestamp-to-date';

const EventRow = ({ event }) => {
  if (!event) {
    return null;
  }

  return (
    <Tr>
      <Td>
        <HiDocumentText size={'2rem'} />
      </Td>
      <Td>{event.title}</Td>
      <Td>0</Td>
      <Td>{timestampToDate(event.date, 'dd-MM-yyyy')}</Td>
      <Td>{event.eventOpenAt}</Td>
      <Td>{event.price}</Td>
      <Td>
        <FiExternalLink size={'1.5rem'} />
      </Td>
    </Tr>
  );
};

export { EventRow };
