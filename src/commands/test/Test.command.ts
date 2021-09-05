import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../ICommand";

export class TestCommand implements ICommand{
    commandId: string = "";

    data: SlashCommandBuilder = new SlashCommandBuilder();
        
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName("test")
            .setDescription("Stub test, for now.")
            .setDefaultPermission(false);
    }

    async execute(interaction: CommandInteraction) {
        await interaction.reply(`Under Construction.`);
    }
}