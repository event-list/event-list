import { Box, Text } from '@chakra-ui/react';
import { graphql, useFragment } from 'react-relay';

import type { ParticipantRowFragment_participant$key } from '../../../../__generated__/ParticipantRowFragment_participant.graphql';

type ParticipantRowProps = {
  fragmentKey: any;
  batch: any;
};

const ParticipantRow = (props: ParticipantRowProps) => {
  const participant = useFragment<ParticipantRowFragment_participant$key>(
    graphql`
      fragment ParticipantRowFragment_participant on Participant {
        name
        batch
      }
    `,
    props.fragmentKey,
  );

  if (participant.batch !== props.batch.title) return <></>;

  return (
    <Box>
      <Text className={props.batch.title}>{participant.name}</Text>
    </Box>
  );
};

export { ParticipantRow };
