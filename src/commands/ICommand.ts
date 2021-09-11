import { CommandInteraction, Message } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders"

export interface ICommand {
    commandId: string;

    data: SlashCommandBuilder;

    execute(interaction: CommandInteraction): void
}