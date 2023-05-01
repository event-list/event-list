import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  StackDivider,
  Stat,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { FacebookIcon, TelegramIcon, TwitterIcon, WhatsappIcon } from 'next-share';
import { BsDoorClosedFill, BsDoorOpenFill } from 'react-icons/bs';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { MdFactCheck } from 'react-icons/md';
import { SiAdblock } from 'react-icons/si';

import { TextDecorated } from '@event-list/ui';

const ShareEventPreview = ({
  flyer,
  title,
  description,
  place,
  classification,
  price,
  dateStart,
  dateEnd,
  listAvailableAt,
}) => {
  const { t } = useTranslation(['ptBR', 'en']);

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 1, md: 7 }}>
      <Center>
        <Box rounded={'lg'} pos={'relative'}>
          {flyer ? (
            <Image rounded={'lg'} min-width={632} height={500} objectFit={'cover'} src={flyer} />
          ) : (
            <Text>{t('Upload a flyer to see it here')}</Text>
          )}
        </Box>
      </Center>
      <Stack spacing={{ base: 2 }} direction={'column'} divider={<StackDivider borderColor={'transparent'} py={1} />}>
        <Stack spacing={2}>
          <TextDecorated fontWeight={'700'} fontSize={{ base: '1xl', sm: '2xl', lg: '3xl' }}>
            {title ? title : t('Fill in a title to see it here')}
          </TextDecorated>
          <Text fontWeight={'700'} fontSize={{ base: 'sm', sm: 'xl' }}>
            {t('your merchant name')}
          </Text>
          <Text textAlign="left" color={'gray.400'} fontSize={'sm'}>
            {description}
          </Text>
        </Stack>
        <Stack spacing={{ base: 2 }} direction={'column'} divider={<StackDivider borderColor={'transparent'} py={1} />}>
          <Stack>
            <TextDecorated fontSize={'md'} fontWeight={'700'}>
              {t('Share it')}
            </TextDecorated>
            <HStack spacing={2}>
              <WhatsappIcon size={32} round />
              <TwitterIcon size={32} round />
              <FacebookIcon size={32} round />
              <TelegramIcon size={32} round />
            </HStack>
          </Stack>
          <Stack>
            <TextDecorated fontSize={'md'} fontWeight={'700'}>
              {t('Place')}
            </TextDecorated>
            <SimpleGrid columns={{ base: 1 }} spacing={10}>
              <List spacing={2}>
                <ListItem>
                  <Text fontSize={{ base: 'small', sm: 'sm', lg: 'sm' }}>
                    {place ? place : t('Fill in a place to see it here')}
                  </Text>
                </ListItem>
              </List>
            </SimpleGrid>
          </Stack>
          <Stack>
            <SimpleGrid columns={{ base: 2 }} spacing={{ base: 5, lg: 8 }}>
              <StatsCard
                title={t('Price')}
                stat={price ? price : t('Fill in a price to see it here')}
                icon={<FaMoneyCheckAlt />}
              />
              <StatsCard
                title={t('Classification')}
                stat={classification ? classification : t('Fill in a classification to see it here')}
                icon={<SiAdblock />}
              />
              <StatsCard
                title={t('Start')}
                stat={dateStart ? dateStart : t('Fill in a start date to see it here')}
                icon={<BsDoorOpenFill />}
              />
              <StatsCard
                title={t('End')}
                stat={dateEnd ? dateEnd : t('Fill in a end date to see it here')}
                icon={<BsDoorClosedFill />}
              />
              <StatsCard
                title={t('List available at')}
                stat={listAvailableAt ? listAvailableAt : t('Fill in a list available at to see it here')}
                icon={<MdFactCheck />}
              />
            </SimpleGrid>
          </Stack>
        </Stack>
      </Stack>
    </SimpleGrid>
  );
};

function StatsCard(props) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 1, md: 3 }}
      py={'2'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={'gray.600'}
      rounded={'lg'}
      bgColor="transparent"
      color={'white'}
    >
      <Flex justifyContent={'space-between'} alignContent="center" alignItems={'center'} px={'1'}>
        <Stack w={'100%'} spacing={2}>
          <Flex justifyContent={'space-between'} alignItems={'center'} w={'100%'}>
            <TextDecorated fontWeight={'500'} fontSize={{ base: 'sm' }}>
              {title}
            </TextDecorated>
            <Box color={'gray.200'} alignContent={'center'} fontSize={{ base: '1rem', sm: '1.5rem' }}>
              {icon}
            </Box>
          </Flex>
          <StatNumber as={Text} fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }} color={'gray.200'}>
            {stat}
          </StatNumber>
        </Stack>
      </Flex>
    </Stat>
  );
}

export { ShareEventPreview };
