import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../ICommand";
import config = require("../../../config.json");


export class ConfigCommand implements ICommand{
    commandId: string = "";

    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder();
        
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
                    .setRequired(true)))
            .addSubcommand(option =>
                option.setName("set")
                .setDescription("Sets a configuration parameter's value.")
                .addStringOption(option => 
                    option.setName("parameter")
                    .setDescription("The parameter whose value is being set.")
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName("value")
                    .setDescription("The value to be set to the parameter.")
                    .setRequired(true)));
    }

    async execute(interaction: CommandInteraction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "get":
                const getParam = interaction.options.getString("parameter") ?? "";
                const getResult = this.getConfig(getParam);
            case "set":
                const setParam = interaction.options.getString("parameter") ?? "";
                const setValue = interaction.options.getString("value") ?? "";
                const paramValue = this.setConfig(setParam, setValue);
            default:
                return;
        }
    }

    setConfig(parameter: string, value: string): string {
        if (!parameter) return "";
        return value;
    }

    getConfig(parameter: string): string {
        if (!parameter) return "";
        return "value";
    }
}