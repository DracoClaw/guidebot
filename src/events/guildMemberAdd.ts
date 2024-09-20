import { GuildMember } from 'discord.js';
import { getOrCreateGuildById } from '../services/database.service';
import { assignRandomTeam } from '../services/role.service';

export default async (
  member: GuildMember,
) => {
  const guild = await getOrCreateGuildById(member.guild.id);

  console.log(`${guild.guildId} | New member: ${member.user.tag}!`);
  assignRandomTeam(member);
};
