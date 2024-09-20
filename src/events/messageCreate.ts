import { Message } from 'discord.js';
import { count, CountingError } from '../services/counting.service';
import { getOrCreateGuildById } from '../services/database.service';
import { easterEgg } from '../services/eggs.service';

export default async (message: Message) => {
  if (message.author.bot) return;

  const guild = await getOrCreateGuildById(message.guildId!);

  if (message.channelId === guild.counting.channel) {
    console.log(`${guild.guildId} | Message Received in the counting channel!`);

    try {
      const result = await count(message, guild);
      if (result) {
        message.react('✅');
        easterEgg(message);
      } else {
        message.react('❌');
      }
    } catch (error) {
      let msg = '';

      switch (error) {
        case CountingError.Limit:
          msg = `Sorry <@${message.author.id}>, you can only count up to ${guild.counting.limit} times in a row.`;
          break;
        case CountingError.NaN:
        case CountingError.NaI:
          msg = `Sorry <@${message.author.id}>, only whole numbers are allowed in this channel.`;
          break;
        default:
          console.error(`${guild.guildId} | Not an Enum Value!`);
      }

      message.reply(msg).then((newMessage: Message) => {
        setTimeout(() => {
          newMessage.delete();
          message.delete();
        }, guild.counting.textTimeout * 1000);
      });

      console.error(`${guild.guildId} | Not counting: ${error}`);
    }
  }
};