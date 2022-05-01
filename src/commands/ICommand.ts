import { CommandInteraction, Message } from "discord.js";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

export interface ICommand {
  commandId: string;

  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;

  isAdminCommand: boolean;

  execute(interaction: CommandInteraction): void;
}
