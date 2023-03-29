import { Box, Center, Flex, HStack, Stack, Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';

import { ParticipantRow } from './table/ParticipantRow';
import type { EventRowFragment_event$data } from '../../../__generated__/EventRowFragment_event.graphql';

type ParticipantsListProps = {
  participants: EventRowFragment_event$data['participants'];
  batches: EventRowFragment_event$data['batches'];
};

const ParticipantsList = ({ participants, batches }: ParticipantsListProps) => {
  return (
    <Flex w={'full'} justifyContent={'space-around'}>
      {batches.map((batch) => (
        <Box key={batch?.date}>
          <Center fontSize={'lg'} fontWeight={'bold'} mb={4}>
            {batch?.title} - {batch?.value}
          </Center>
          {participants?.edges?.map((participant) => (
            <ParticipantRow key={batch?.date} fragmentKey={participant?.node} batch={batch} />
          ))}
        </Box>
      ))}
    </Flex>
  );
};

// const asa = () => {
//   return (
//     <TableContainer>
//       <Table variant="simple" size="sm">
//         <Thead>
//           <Tr></Tr>
//         </Thead>
//         <Tbody>
//           {participants?.edges?.map((participant, index) => (
//             <Tr key={index}>
//               {batches.map((batch) => {
//                 return (
//                   <ParticipantTd
//                     key={batch?.date}
//                     fragmentKey={participant?.node}
//                     batch={batch}
//                   />
//                 );
//               })}
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </TableContainer>
//   );
// };

export { ParticipantsList };
