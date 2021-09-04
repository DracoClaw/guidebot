import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../ICommand";

export class PingCommand implements ICommand{
    commandId: string = "";

    data: SlashCommandBuilder = new SlashCommandBuilder();
        
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with Pong!")
            .setDefaultPermission(false);
    }

    async execute(interaction: CommandInteraction) {
        await interaction.reply("Pong!");
    }
}