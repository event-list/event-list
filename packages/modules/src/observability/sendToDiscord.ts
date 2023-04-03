import axios from 'axios';

import { config } from '@event-list/shared';

type SendToDiscordProps = {
  url?: string;
  content: string;
};

export const sendToDiscord = async ({ url, content }: SendToDiscordProps) => {
  const payload = {
    content,
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,import/namespace
  const discordChannel = url ?? config.DISCORD_GENERAL_WEBHOOK!;

  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return await axios.post(discordChannel, payload, options);
};
