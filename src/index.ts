import { Client, Collection } from 'discord.js';
import 'dotenv/config';
import guildMemberAdd from './events/guildMemberAdd';
import guildMemberUpdate from './events/guildMemberUpdate';
import interactionCreate from './events/interactionCreate';
import messageCreate from './events/messageCreate';
import messageDelete from './events/messageDelete';
import ready from './events/ready';
import { CommandHandler } from './utils/commandHandler';
import { ICommand } from './utils/ICommand';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>;
  }
}

const client = new Client({
  intents: [
    'Guilds',
    'MessageContent',
    'GuildMembers',
    'GuildMessages',
    'GuildPresences',
  ],
});

const commandHandler = new CommandHandler();

client.commands = new Collection();

commandHandler.registerCommands().then(() => {
  const commandObjects = commandHandler.commandObjects;

  commandObjects.forEach((command: ICommand) => {
    client.commands.set(command.data.name, command);
  });
});

client.on('ready', () => ready(client));
client.on('guildMemberAdd', (member) => guildMemberAdd(member));
client.on('interactionCreate', (interaction) => interactionCreate(interaction, client));
client.on('messageCreate', (message) => messageCreate(message));
client.on('messageDelete', (message) => messageDelete(message, client));
client.on('guildMemberUpdate', (oldMember, newMember) => guildMemberUpdate(oldMember, newMember, client));

client.login(process.env.BOT_TOKEN);