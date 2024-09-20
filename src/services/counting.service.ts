import { EmbedBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { GuideGuild } from '../models';
import { updateGuild } from './database.service';

export enum CountingError {
  Limit = "Limit Reached!",
  NaN = "Not a Number!",
  NaI = "Not an Integer!",
}

async function validateCount(message: Message): Promise<number> {
  const newCount = Number(message.content);
  if (isNaN(newCount)) {
    throw new Error(CountingError.NaN);
  }

  if (!Number.isInteger(newCount)) {
    throw new Error(CountingError.NaI);
  }

  return newCount;
}

async function checkLimit(guild: GuideGuild, userId: string): Promise<void> {
  if (guild.counting.lastUserID === userId && guild.counting.currLimit >= guild.counting.limit) {
    throw new Error(CountingError.Limit);
  }
}

async function updateHighscore(message: Message, guild: GuideGuild, oldCount: number): Promise<void> {
  const currHighscore = guild.counting.bestCount;
  if (currHighscore < oldCount) {
    guild.counting.bestCount = oldCount;
    const embedMsg = new EmbedBuilder()
      .setTitle('HIGH SCORE')
      .setDescription(
        `<@${guild.counting.lastUserID}>: [${oldCount}](https://discord.com/channels/${guild.guildId}/${guild.counting.channel}/${guild.counting.lastMsgId})`
      )
      .setTimestamp();

    try {
      const msg = await message.channel.messages.fetch(guild.counting.embedMsg);
      await msg.edit({ embeds: [embedMsg] });
    } catch (error) {
      console.error(`${guild.guildId} | Unable to get Embed Message: ${error}`);
    }

    await message.channel.send(
      `NEW HIGHSCORE!! We reached **${oldCount}**! Let's try to surpass that!`
    );
  }
}

async function resetCount(guild: GuideGuild, message: Message, oldCount: number): Promise<void> {
  await updateHighscore(message, guild, oldCount);
  guild.counting.currCount = 0;
  await updateGuild(guild);
}

async function updateCount(guild: GuideGuild, message: Message, newCount: number): Promise<void> {
  if (guild.counting.lastUserID === message.author.id) {
    guild.counting.currLimit++;
  } else {
    guild.counting.lastUserID = message.author.id;
    guild.counting.currLimit = 1;
  }

  guild.counting.currCount = newCount;
  guild.counting.lastMsgId = message.id;
  await updateGuild(guild);
}

export async function count(message: Message, guild: GuideGuild): Promise<boolean> {
  try {
    const newCount = await validateCount(message);
    await checkLimit(guild, message.author.id);

    const oldCount = guild.counting.currCount;
    console.log(`${guild.guildId} | Current Count: ${oldCount}`);

    if (oldCount + 1 !== newCount) {
      await message.channel.send(
        `Sorry <@${message.author.id}>, but that is not right. The next number was **${oldCount + 1}**. Let's start over!`
      );
      await resetCount(guild, message, oldCount);
      return false;
    }

    await updateCount(guild, message, newCount);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}