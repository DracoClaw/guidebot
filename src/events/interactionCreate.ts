import { Client, Interaction } from 'discord.js';
import { getOrCreateGuildById } from '../services/database.service';
import { ICommand } from '../utils/ICommand';

export default async (interaction: Interaction, client: Client) => {
  if (!interaction.isCommand()) return;

  const guild = await getOrCreateGuildById(interaction.guildId!);

  console.log(`${guild.guildId} | Command Triggered!`);

  const commandName = interaction.commandName;

  console.log(`CommandName: ${commandName}`);

  if (commandName) {
    const commandToExecute: ICommand = client.commands.get(commandName);
    if (commandToExecute) commandToExecute.execute(interaction);
  }
};