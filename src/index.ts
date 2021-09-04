import { Client, Collection, Intents, Interaction, ApplicationCommandPermissionData} from "discord.js";
import { REST } from "@discordjs/rest";
import { GuildDefaultMessageNotifications, Routes } from 'discord-api-types/v9';
import config = require("../config.json");
import { CommandHandler } from "./utils/commandHandler"
import { ICommand } from "./commands/ICommand";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
    }
}

const clientId = "882194073287528468";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commandHandler = new CommandHandler(clientId);

client.commands = new Collection();

commandHandler.registerCommands().then(() => {
    const commandObjects = commandHandler.commandObjects;

    commandObjects.forEach((command: ICommand) => {
        client.commands.set(command.data.name, command);
    });
});

client.on("ready", () => {
    console.log("GuideBot Started!");
    
    client.application?.fetch().then((application) => {
        const guild = client.guilds.cache.get("695630972082978986");
        if (guild) {
            console.log(`Guild: ${guild?.name}`);
            commandHandler.commandObjects.forEach((command) => {
                guild.commands.fetch(command.commandId).then((appCommand) => {
                    const permissions: ApplicationCommandPermissionData[] = [
                        {
                            id: "723281594286080100",
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
})

client.login(config.token);