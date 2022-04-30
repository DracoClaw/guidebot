import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { getOrCreateGuildById, updateGuild } from "../../services/database.service";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../ICommand";
import { GuideGuild } from "../../models";


export class ConfigCommand implements ICommand{
    commandId: string = "";

    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder();

    isAdminCommand: boolean = true;
        
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName("config")
            .setDescription("Configure paramaters")
            .setDefaultPermission(false)
            .addSubcommand(option =>
                option.setName("get")
                .setDescription("Gets a configuration parameter's value.")
                .addStringOption(option => 
                    option.setName("parameter")
                    .setDescription("The parameter whose value is being get.")
                    .setRequired(true)
                    .addChoice("Counting Channel", "count.Channel")
                    .addChoice("Counting Embed", "count.Embed")))
            .addSubcommand(option =>
                option.setName("set")
                .setDescription("Sets a configuration parameter's value.")
                .addStringOption(option => 
                    option.setName("parameter")
                    .setDescription("The parameter whose value is being set.")
                    .setRequired(true)
                    .addChoice("Counting Channel", "count.Channel")
                    .addChoice("Counting Embed", "count.Embed"))
                .addStringOption(option =>
                    option.setName("value")
                    .setDescription("The value to be set to the parameter.")
                    .setRequired(true)));
    }

    async execute(interaction: CommandInteraction) {
        const subCommand = interaction.options.getSubcommand();
        const guild = await getOrCreateGuildById(interaction.guildId!);

        switch (subCommand) {
            case "get":
                const getParam = interaction.options.getString("parameter") ?? "";
                this.getConfig(getParam, guild)
                .then((result) => interaction.reply(`Parameter "${getParam}": ${result}`))
                .catch((error) => interaction.reply(`Failed to get "${getParam}" value: ${error}`));
                break;
            case "set":
                const setParam = interaction.options.getString("parameter") ?? "";
                const setValue = interaction.options.getString("value") ?? "";
                this.setConfig(setParam, setValue, guild)
                .then((result) => {
                    let replyMsg = result
                        ? `Parameter "${setParam}" successfully updated with value "${setValue}"!`
                        : `Failed to update the "${setParam}" parameter. Please, contact the devs!`
                    interaction.reply(replyMsg);
                })
                .catch((error) => interaction.reply(`Failed to update the "${setParam}" parameter due to the following reason: ${error}`));
                break;
            default:
                return;
        }
    }

    setConfig(parameter: string, value: string, guild: GuideGuild): Promise<boolean> {
        if (!parameter) return Promise.reject("Empty Parameter!");

        let update = false;

        switch(parameter) {
            case "count.Channel":
                guild.counting.channel = value
                update = true;
                break;
            case "count.Embed":
                guild.counting.embedMsg = value
                update = true;
                break;
        }

        if (update) { 
            return new Promise((resolve) => {
                updateGuild(guild)
                .then((guild) => {
                    console.log(`Guild "${guild.guildId}": Parameter ${parameter} updated with value "${value}"`);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(`Failed to update Guild "${guild.guildId}": Parameter ${parameter} with value "${value}": ${error}`);
                    resolve(false);
                }); 
            })
        }
        else return Promise.reject("Parameter not found!");
    }

    getConfig(parameter: string, guild: GuideGuild): Promise<string> {
        if (!parameter) return Promise.reject("Empty Parameter!");

        let value = "";

        switch(parameter) {
            case "count.Channel":
                value = guild.counting.channel
                break;
            case "count.Embed":
                value = guild.counting.embedMsg
                break;
        }
        
        if (value) return Promise.resolve(value);
        else return Promise.reject("Value not found or currently empty!");
    }
}