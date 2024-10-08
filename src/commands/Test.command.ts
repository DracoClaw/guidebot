import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ICommand } from "../utils/ICommand";

export class TestCommand implements ICommand {
  commandId: string = "";

  data: SlashCommandBuilder = new SlashCommandBuilder();

  isAdminCommand: boolean = true;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("test")
      .setDescription(
        "Misc test command. Currently sends a new Counting HS Embed."
      );
    //.setDefaultPermission(false);
  }

  async execute(interaction: CommandInteraction) {
    const embedMsg = new EmbedBuilder()
      .setTitle("HIGH SCORE")
      .setDescription("<@341680387979870219>: 0")
      .setTimestamp();

    await interaction.channel?.send({ embeds: [embedMsg] });
  }
}
