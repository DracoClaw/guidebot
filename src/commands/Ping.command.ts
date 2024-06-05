import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../utils/ICommand";

export class PingCommand implements ICommand {
  commandId: string = "";

  data: SlashCommandBuilder = new SlashCommandBuilder();

  isAdminCommand: boolean = true;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Returns the WebSocket Latency.");
    //.setDefaultPermission(false);
  }

  async execute(interaction: CommandInteraction) {
    await interaction.reply(`Ping: ${interaction.client.ws.ping}ms`);
  }
}
