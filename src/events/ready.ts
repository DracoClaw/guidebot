import { Client } from 'discord.js';
import { connect } from '../services/database.service';

export default async (client: Client) => {
  console.log('GuideBot Starting!');

  client.user?.setPresence({
    status: 'online',
    activities: [
      {
        name: 'Animal Crossing: New Horizons',
        type: 'PLAYING',
      },
    ],
  });

  try {
    await client.application?.fetch();
    await connect();
    console.log('Connected to MongoDB!');
    console.log('GuideBot Started!');
  } catch (error) {
    console.error(`Unable to start GuideBot: ${error}`);
  }
};