import { Client, Collection, Intents, Interaction, ApplicationCommandPermissionData, Message, GuildMember, PartialGuildMember, TextChannel} from "discord.js";
import { connect, getOrCreateGuildById } from "./services/database.service";
import { count } from "./services/counting.service";
import { assignRandomTeam } from "./services/role.service";
import config = require("../config.json");
import { CommandHandler } from "./utils/commandHandler"
import { ICommand } from "./commands/ICommand";
import { CountingError } from "./models";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
    }
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const commandHandler = new CommandHandler(config.clientId);

client.commands = new Collection();

commandHandler.registerCommands().then(() => {
    const commandObjects = commandHandler.commandObjects;

    commandObjects.forEach((command: ICommand) => {
        client.commands.set(command.data.name, command);
    });
});

client.on("ready", () => {
    console.log("GuideBot Starting!");

    client.user?.setPresence({
        status: "online",
        activities: [
            {
                name: "Animal Crossing: New Horizons",
                type: "PLAYING"
            }
        ]
    });
    
    client.application?.fetch().then((application) => {
        connect()
        .then(() => console.log("Connected to MongoDB!"))
        .then(() => {
            client.guilds.cache.forEach((guild, guildId, guildMap) => {
                if (guild) {
                    getOrCreateGuildById(guild.id).then((guildConfig) => {
                        console.log(`Setting Staff Role permissions to Guild: ${guild.name}`);
                        commandHandler.commandObjects.forEach((command) => {
                            guild.commands.fetch(command.commandId).then((appCommand) => {
                                console.log(`Setting Perms to command: ${command.data.name}`);

                                const permissions: ApplicationCommandPermissionData[] = [
                                    {
                                        id: guildConfig.staffRole,
                                        permission: true,
                                        type: "ROLE"
                                    }
                                ];
            
                                appCommand.permissions.add({ permissions });
                            })
                            .catch((error) => console.error(`Unable to set permissions to command "${command.data.name}" for guild "${guild.name}": ${error}`));
                        });
                    });
                }
            });
            console.log("GuideBot Started!");
        })
        .catch((error) => console.error(`Unable to start GuideBot: ${error}`));
    });
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    console.log("Command Triggered!");

    const commandName = interaction.commandName;

    console.log(`CommandName: ${commandName}`);

    if (commandName) {
        const commandToExecute: ICommand = client.commands.get(commandName);
        if (commandToExecute) commandToExecute.execute(interaction);
    }
}).on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    const guild = await getOrCreateGuildById(message.guildId!);

    if (message.channelId === guild.counting.channel) {
        console.log(`Message Received in the counting channel!`);

        count(message, guild)
        .then((result) => {
            if (result) {
                message.react("✅");
            } else {
                message.react("❌");
            }
        })
        .catch((error:CountingError|string) => {
            let msg = "";

            switch (error) {
                case CountingError.Limit: 
                    msg = `Sorry <@${message.author.id}>, you can only count up to ${guild.counting.limit} times in a row.`;

                    message.reply(msg)
                    .then((newMessage: Message) => {
                        message.delete();

                        setTimeout(() => {
                            newMessage.delete();
                        }, guild.counting.textTimeout * 1000);
                    });
                    break;
                
                case CountingError.NaN:
                case CountingError.NaI:
                    msg = `Sorry <@${message.author.id}>, only whole numbers are allowed in this channel.`;

                    message.reply(msg)
                    .then((newMessage: Message) => {
                        setTimeout(() => {
                            newMessage.delete();
                            message.delete();
                        }, guild.counting.textTimeout * 1000);
                    });

                    break;

                default: 
                    console.error("Not an Enum Value!");
            }

            console.error(`Not counting: ${error}`);
        });
    }
});

client.on("guildMemberUpdate", async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    console.log(`guildMemberUpdate Triggered!`);
    
    const memberRoleId = '702305122713206794'; // TODO: set this up as a config
	const patreonRoleId = '730040122464141392';
    const staffChannel = client.channels.cache.get('702303566458519573') as TextChannel;
    const supporterChannel = client.channels.cache.get('753227742895407226') as TextChannel;

    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
        // channel?.send(`Role${removedRoles.size > 1 ? 's' : ''} ${removedRoles.map(role => role.name).join(", ")} removed from ${oldMember.displayName}!`);
        console.log(`Role${removedRoles.size > 1 ? 's' : ''} ${removedRoles.map(role => role.name).join(", ")} removed from ${oldMember.displayName}!`);
    }

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        // channel?.send(`Role${addedRoles.size > 1 ? 's' : ''} ${addedRoles.map(role => role.name).join(", ")} added to ${oldMember.displayName}!`);
        console.log(`Role${addedRoles.size > 1 ? 's' : ''} ${addedRoles.map(role => role.name).join(", ")} added to ${oldMember.displayName}!`);
    }

    if (addedRoles.hasAny(memberRoleId)) {
        // channel?.send(`New member: ${oldMember.user.tag}!`);
        console.log(`New member: ${oldMember.user.tag}!`);
        assignRandomTeam(newMember);
    }
	
   if (addedRoles.hasAny(patreonRoleId)) {
        staffChannel?.send(`New Patreon Supporter: ${oldMember.user}!`);
        supporterChannel?.send(`Welcome ${oldMember.user}! Thank you for suppoting GeneSy on Patreon. <:emoteLove:699777339235500042>`);
        console.log(`New member: ${oldMember.user.tag}!`);
    }
	
    if (newMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp !== oldMember.premiumSinceTimestamp) {
        staffChannel?.send(`New Server Booster: ${oldMember.user}!`);
        supporterChannel?.send(`Welcome ${oldMember.user}! Thank you for Boosting the server. <:emoteLove:699777339235500042>`);
        console.log(`New member: ${oldMember.user.tag}!`);    }
});

client.login(config.token);