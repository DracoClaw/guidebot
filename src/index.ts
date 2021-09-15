import { Client, Collection, Intents, Interaction, ApplicationCommandPermissionData, Message, Presence, MessageEmbed} from "discord.js";
import { REST } from "@discordjs/rest";
import { GuildDefaultMessageNotifications, Routes } from 'discord-api-types/v9';
import config = require("../config.json");
import { CommandHandler } from "./utils/commandHandler"
import { ICommand } from "./commands/ICommand";
import { resolveModuleName } from "typescript";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
    }
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const commandHandler = new CommandHandler(config.clientId);

client.commands = new Collection();

commandHandler.registerCommands().then(() => {
    const commandObjects = commandHandler.commandObjects;

    commandObjects.forEach((command: ICommand) => {
        client.commands.set(command.data.name, command);
    });
});

client.on("ready", () => {
    console.log("GuideBot Started!");

    console.log(`Getting Env Var: ${process.env.LIVE_DB}`);

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
        const guild = client.guilds.cache.get(config.guildId);
        if (guild) {
            console.log(`Setting Staff Role permissions to Guild: ${guild?.name}`);
            commandHandler.commandObjects.forEach((command) => {
                console.log(`Setting Perms to command: ${command.data.name} - id: ${command.commandId}`);
                guild.commands.fetch(command.commandId).then((appCommand) => {
                    const permissions: ApplicationCommandPermissionData[] = [
                        {
                            id: config.staffRole,
                            permission: true,
                            type: "ROLE"
                        }
                    ];

                    appCommand.permissions.add({ permissions });
                });
            });
        }
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

    console.log(`Message Received!`);

    if (message.channelId === config.countingChannel) {
        await count(message)
            .then((result) => {
                if (result) {
                    message.react("✅");
                } else {
                    message.react("❌");
                }
            })
            .catch((error) => {
                message.reply(`Sorry <@${message.author.id}>, only numbers are allowed in this channel.`)
                    .then((newMessage: Message) => {
                        setTimeout(() => {
                            newMessage.delete();
                            message.delete();
                        }, config.counting.textTimeout * 1000);
                    });
                console.error(`Not counting: ${error}`);
            });
    }
});

client.login(config.token);

async function count(message: Message): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const newCount = Number(message.content);
            if (isNaN(newCount)) {
                reject("Not a Number!");
                return;
            }

            if (!parseInt(message.content, 10) || newCount.toString().indexOf('.') > -1 || newCount.toString().indexOf(',') > -1) {
                reject("Not a Integer!");
                return;
            }

            const oldCount = config.counting.currCount;
            console.log(`Current Count: ${oldCount}`);

            if (oldCount + 1 !== newCount) {
                message.channel.send(`Sorry <@${message.author.id}>, but that is not right. The next number was **${oldCount + 1}**. Let's start over!`);

                let currHighscore = config.counting.bestCount;
                if (currHighscore < oldCount) {
                    config.counting.bestCount = oldCount;
                    let embedMsg = message.channel.messages.fetch("886304948260851772").then((msg: Message) => {
                        const embedMsg = new MessageEmbed()
                        .setTitle("HIGH SCORE")
                        .setDescription(`[${oldCount.toString()}](https://discord.com/channels/${config.guildId}/${config.countingChannel}/${config.counting.lastMsgId})`)
                        .setFooter(config.counting.lastUserTag)
                        .setTimestamp();
                        msg.edit({ embeds: [embedMsg] })
                    });
                    message.channel.send(`NEW HIGHSCORE!! We reached **${oldCount}**! Let's try to surpass that!`);
                }

                config.counting.currCount = 0;
                resolve(false);
                return;
            }

            config.counting.currCount = newCount;
            config.counting.lastUserTag = message.author.tag;
            config.counting.lastMsgId = message.id;
            resolve(true);
        } catch(error) {
            reject(error);
        }
    });
};
