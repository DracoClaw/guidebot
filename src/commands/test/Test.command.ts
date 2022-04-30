import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { ICommand } from "../ICommand";

export class TestCommand implements ICommand{
    commandId: string = "";

    data: SlashCommandBuilder = new SlashCommandBuilder();

    isAdminCommand: boolean = true;
        
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName("test")
            .setDescription("Stub test, for now.")
            .setDefaultPermission(false);
    }

    async execute(interaction: CommandInteraction) {
        const embedMsg = new MessageEmbed()
        .setTitle("HIGH SCORE")
        .setDescription("0")
        .setFooter("<@341680387979870219>")
        .setTimestamp();

        await interaction.channel?.send({ embeds: [embedMsg] });
    }
}