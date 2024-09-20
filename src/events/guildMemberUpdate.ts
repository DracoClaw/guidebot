import { Client, GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import {
  GENERAL_CHANNEL_ID,
  STAFF_CHANNEL_ID,
  SUPPORTER_CHANNEL_ID
} from '../config';
import { getOrCreateGuildById } from '../services/database.service';

export default async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember,
  client: Client
) => {
  const guild = await getOrCreateGuildById(oldMember.guild.id);

  console.log(`${guild.guildId} | guildMemberUpdate Triggered!`);

  const staffChannel = client.channels.cache.get(STAFF_CHANNEL_ID) as TextChannel;
  const supporterChannel = client.channels.cache.get(SUPPORTER_CHANNEL_ID) as TextChannel;
  const generalChannel = client.channels.cache.get(GENERAL_CHANNEL_ID) as TextChannel;
  const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

  if (removedRoles.size > 0) {
    console.log(
      `${guild.guildId} | Role${removedRoles.size > 1 ? 's' : ''} ${removedRoles
        .map((role) => role.name)
        .join(', ')} removed from ${oldMember.displayName}!`
    );
  }

  const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
  if (addedRoles.size > 0) {
    console.log(
      `${guild.guildId} | Role${addedRoles.size > 1 ? 's' : ''} ${addedRoles
        .map((role) => role.name)
        .join(', ')} added to ${oldMember.displayName}!`
    );
  }

  // Handle spacer roles
  const handleSpacerRoles = (groupRoles: string[], spacerRole: string, groupName: string) => {
    if (newMember.roles.cache.hasAny(...groupRoles)) {
      if (!newMember.roles.cache.hasAny(spacerRole)) {
        console.log(`${guild.guildId} | Group ${groupName} role added: ${oldMember.user.tag}!`);
        oldMember.roles.add(spacerRole, `User has a Group ${groupName} role.`);
      }
    } else if (newMember.roles.cache.hasAny(spacerRole)) {
      console.log(`${guild.guildId} | Group ${groupName} role removed: ${oldMember.user.tag}!`);
      oldMember.roles.remove(spacerRole, `User has no Group ${groupName} roles.`);
    }
  };

  handleSpacerRoles(guild.spacer.aRoles, guild.spacer.aSpacer, 'A');
  handleSpacerRoles(guild.spacer.bRoles, guild.spacer.bSpacer, 'B');
  handleSpacerRoles(guild.spacer.cRoles, guild.spacer.cSpacer, 'C');

  if (
    newMember.premiumSinceTimestamp &&
    newMember.premiumSinceTimestamp !== oldMember.premiumSinceTimestamp
  ) {
    staffChannel?.send(
      `New Server Booster: ${oldMember.user}! Don't forget to give them points in 7 days.`
    );
    supporterChannel?.send(
      `Welcome ${oldMember.user}! Thank you for Boosting the server. <:emoteLove:699777339235500042>`
    );
    generalChannel
      ?.send({
        embeds: [
          {
            title: `<:serverBoost:870144685333676102> ${oldMember.user.tag} has boosted the server! <:serverBoost:870144685333676102>`,
            color: 16023551,
            description: `The generous member ${oldMember.user} just boosted the server!!\nLets keep it up!! <:emoteLove:699777339235500042>`,
            thumbnail: {
              url: `${oldMember.displayAvatarURL()}`,
            },
            footer: {
              text: 'After 7 days of boosting, your team will be awarded 50 points.',
            },
          },
        ],
      })
      .catch(console.error);
  }
};