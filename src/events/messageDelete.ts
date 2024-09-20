import { Client, Message, PartialMessage, TextChannel } from 'discord.js';
import { getOrCreateGuildById } from '../services/database.service';

export default async (message: Message | PartialMessage, client: Client) => {
  const guild = await getOrCreateGuildById(message.guildId!);
  const countChannel = client.channels.cache.get(guild.counting.channel) as TextChannel;

  if (message.channelId !== guild.counting.channel) return;
  if (message.id !== guild.counting.lastMsgId) return;
  await countChannel?.send(`${message.author}: ${message.content}`);
  console.log(`${guild.guildId} | Message deleted in the counting channel!`);
};