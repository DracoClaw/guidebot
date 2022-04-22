import 'dotenv/config';

import { Client, Collection, Intents, Interaction, ApplicationCommandPermissionData, Message, MessageEmbed, GuildMember, PartialGuildMember, TextChannel} from "discord.js";
import { connect, getOrCreateGuildById } from "./services/database.service";
import { count } from "./services/counting.service";
import { assignRandomTeam } from "./services/role.service";
import { easterEgg } from "./services/eggs.service";
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
				easterEgg(message);
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

client.on ("messageDelete", async (message) => {
    const guild = await getOrCreateGuildById(message.guildId!);
    const countChannel = client.channels.cache.get(guild.counting.channel) as TextChannel;

    if (message.channelId !== guild.counting.channel) return;
    if (message.id !== guild.counting.lastMsgId) return;
    await countChannel?.send(`${message.author}: ${message.content}`);
    console.log(`Message deleted in the counting channel!`);
  });

client.on("guildMemberUpdate", async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    console.log(`guildMemberUpdate Triggered!`);
    
    const memberRoleId = '702305122713206794'; // TODO: set this up as a config
	const patreonRoleId = '730040122464141392';
    const staffChannel = client.channels.cache.get('702303566458519573') as TextChannel;
    const supporterChannel = client.channels.cache.get('753227742895407226') as TextChannel;
	const generalChannel = client.channels.cache.get('697796824110465025') as TextChannel;
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	const guild = await getOrCreateGuildById(oldMember.guild.id);
	
	const aSpacer = `842130955761221663`;
	const bSpacer = '702325520460808314';
	const cSpacer = '932305047981801543';
	
	const patreonEmbed = new MessageEmbed()
  .setTitle(`${oldMember.user.tag} has pledged on Patreon!`)
  .setDescription(`The amazing ${newMember.user} has decided to support the app and pledged on GeneSy's [Patreon](https://www.patreon.com/genesy)! Thank you so much! <:emoteLove:699777339235500042>`)
  .setColor("#F56754")
  .setThumbnail(`${oldMember.displayAvatarURL()}`);
	
	const boostEmbed = new MessageEmbed()
  .setTitle(`<:serverBoost:870144685333676102> ${oldMember.user.tag} has boosted the server! <:serverBoost:870144685333676102>`)
  .setDescription(`The generous member ${oldMember.user} just boosted the server!!\nLets keep it up!! <:emoteLove:699777339235500042>`)
  .setColor("#F47FFF")
  .setFooter("After 7 days of boosting, your team will be awarded 50 points.")
  .setThumbnail(`${oldMember.displayAvatarURL()}`);
	
    if (removedRoles.size > 0) {
        // channel?.send(`Role${removedRoles.size > 1 ? 's' : ''} ${removedRoles.map(role => role.name).join(", ")} removed from ${oldMember.displayName}!`);
        console.log(`Role${removedRoles.size > 1 ? 's' : ''} ${removedRoles.map(role => role.name).join(", ")} removed from ${oldMember.displayName}!`);
    }

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        // channel?.send(`Role${addedRoles.size > 1 ? 's' : ''} ${addedRoles.map(role => role.name).join(", ")} added to ${oldMember.displayName}!`);
        console.log(`Role${addedRoles.size > 1 ? 's' : ''} ${addedRoles.map(role => role.name).join(", ")} added to ${oldMember.displayName}!`);
    }

    if (newMember.roles.cache.hasAny(...guild.spacer.aRoles)) {
        if (!newMember.roles.cache.hasAny(aSpacer)) {
        console.log(`Group A role added: ${oldMember.user.tag}!`);
		oldMember.roles.add(aSpacer, 'User has a Group A role.');
    }}
	
	if (!newMember.roles.cache.hasAny(...guild.spacer.aRoles)) {
        if (newMember.roles.cache.hasAny(aSpacer)) {
        console.log(`Group A role removed: ${oldMember.user.tag}!`);
		oldMember.roles.remove(aSpacer, 'User has no Group A roles.');
    }}
	
    if (newMember.roles.cache.hasAny(...guild.spacer.bRoles)) {
        if (!newMember.roles.cache.hasAny(bSpacer)) {
        console.log(`Group B role added: ${oldMember.user.tag}!`);
		oldMember.roles.add(bSpacer, 'User has a Group B role.');
    }}
	
	if (!newMember.roles.cache.hasAny(...guild.spacer.bRoles)) {
        if (newMember.roles.cache.hasAny(bSpacer)) {
        console.log(`Group B role removed: ${oldMember.user.tag}!`);
		oldMember.roles.remove(bSpacer, 'User has no Group B roles.');
    }}
	
	if (newMember.roles.cache.hasAny(...guild.spacer.cRoles)) {
        if (!newMember.roles.cache.hasAny(cSpacer)) {
        console.log(`Group C role added: ${oldMember.user.tag}!`);
		oldMember.roles.add(cSpacer, 'User has a Group C role.');
    }}
	
	if (!newMember.roles.cache.hasAny(...guild.spacer.cRoles)) {
        if (newMember.roles.cache.hasAny(cSpacer)) {
        console.log(`Group C role removed: ${oldMember.user.tag}!`);
		oldMember.roles.remove(cSpacer, 'User has no Group C roles.');
    }}
	
	if (addedRoles.hasAny(memberRoleId)) {
        // channel?.send(`New member: ${oldMember.user.tag}!`);
        console.log(`New member: ${oldMember.user.tag}!`);
        assignRandomTeam(newMember);
    }
	
   if (addedRoles.hasAny(patreonRoleId)) {
        staffChannel?.send(`New Patreon Supporter: ${oldMember.user}!`);
        supporterChannel?.send(`Welcome ${oldMember.user}! Thank you for suppoting GeneSy on Patreon. <:emoteLove:699777339235500042>`);
		generalChannel?.send({embeds: [patreonEmbed]}).catch(console.error);
        console.log(`New member: ${oldMember.user.tag}!`);
    }
	
    if (newMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp !== oldMember.premiumSinceTimestamp) {
        staffChannel?.send(`New Server Booster: ${oldMember.user}! Don't forget to give them points in 7 days.`);
        supporterChannel?.send(`Welcome ${oldMember.user}! Thank you for Boosting the server. <:emoteLove:699777339235500042>`);
		generalChannel?.send({embeds: [boostEmbed]}).catch(console.error);
        console.log(`New member: ${oldMember.user.tag}!`);    }
});

client.login(config.token);
