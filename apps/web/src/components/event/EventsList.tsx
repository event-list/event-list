import { Box, Center, Flex, Heading, Image, SimpleGrid, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { graphql, usePaginationFragment } from 'react-relay'
import timestampToDate from 'timestamp-to-date'
import { EventsListFragment_query$key } from '../../../__generated__/EventsListFragment_query.graphql'
import { EventsListPagination_query } from '../../../__generated__/EventsListPagination_query.graphql'
import { TextDecorated } from '@event-list/ui'

const EventsListFragment = graphql`
  fragment EventsListFragment_query on Query
  @argumentDefinitions(first: { type: Int, defaultValue: 20 }, after: { type: String })
  @refetchable(queryName: "EventsListPagination_query") {
    events(first: $first, after: $after) @connection(key: "Events_events") {
      edges {
        node {
          id
          title
          description
          slug
          flyer
          label
          published
          date
          eventOpenAt
          eventEndAt
          listAvailableAt
          classification
          price
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`

export default function EventsList(props: { fragmentKey: EventsListFragment_query$key }) {
  const { data, loadNext } = usePaginationFragment<EventsListPagination_query, EventsListFragment_query$key>(
    EventsListFragment,
    props.fragmentKey
  )

  const events = data.events

  if (!events.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px">
        <Text>Events not found</Text>
      </SimpleGrid>
    )
  }

  return (
    <SimpleGrid minChildWidth="350px" spacing="20px">
      {events.edges.map(event => (
        <>
          {event?.node && event?.node.published && (
            <Link href={`/event/${event?.node?.id}`}>
              <Center py={12}>
                <Box
                  role={'group'}
                  p={6}
                  maxW={'330px'}
                  w={'full'}
                  bg='gray.800'
                  boxShadow={'2xl'}
                  rounded={'lg'}
                  pos={'relative'}
                  zIndex={1}
                >
                  <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={'230px'}
                    _after={{
                      transition: 'all .3s ease',
                      content: '""',
                      w: 'full',
                      h: 'full',
                      pos: 'absolute',
                      top: 2,
                      left: 0,
                      backgroundImage: `url(${event?.node?.flyer ?? ''})`,
                      filter: 'blur(15px)',
                      zIndex: -1
                    }}
                    _groupHover={{
                      _after: {
                        filter: 'blur(20px)'
                      }
                    }}
                  >
                    <Image rounded={'lg'} height={250} width={282} objectFit={'cover'} src={event?.node?.flyer ?? ''} />
                  </Box>
                  <Stack pt={10} align={'center'}>
                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                      {event?.node?.label}
                    </Text>
                    <TextDecorated
                      fontSize={'2xl'}
                      fontFamily={'body'}
                      fontWeight={'bold'}
                    >
                      {event?.node?.title}
                    </TextDecorated>
                    <Box>
                      <Text fontWeight={700} fontSize={'lg'}>
                        {timestampToDate(event?.node?.date, 'yyyy-MM-dd')}
                      </Text>
                    </Box>
                    <Flex alignItems="center" justifyContent="space-between" w="60%">
                      <Box>
                        <VStack spacing={0}>
                          <TextDecorated
                            fontWeight={'semibold'}
                            fontSize={'sm'}
                          >
                            Open At
                          </TextDecorated>
                          <Text as={'span'} fontWeight={700} fontSize={'lg'}>
                            {event?.node?.eventOpenAt}
                          </Text>
                        </VStack>
                      </Box>
                      <Box>
                        <VStack spacing={0}>
                          <TextDecorated
                            fontWeight={'semibold'}
                            fontSize={'sm'}
                          >
                            End At
                          </TextDecorated>
                          <Text as={'span'} fontWeight={700} fontSize={'lg'}>
                            {event?.node?.eventEndAt}
                          </Text>
                        </VStack>
                      </Box>
                    </Flex>
                  </Stack>
                </Box>
              </Center>
            </Link>
          )}
        </>
      ))}
    </SimpleGrid>
  )
}
