import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import Commands from "../commands";
import { ICommand } from "./ICommand";

export class CommandHandler {
  private clientId = process.env.APP_ID!;
  private token = process.env.BOT_TOKEN!;
  private commands: any[] = [];
  commandObjects: ICommand[] = [];
  private rest = new REST().setToken(this.token);

  async registerCommands(): Promise<void> {
    this.initializeCommands();
    await this.registerCommandsWithDiscord();
  }

  private initializeCommands(): void {
    Commands.forEach((CommandClass) => {
      const commandInstance = new CommandClass();
      const commandJSON = this.processAdminPermissions(
        commandInstance.data.toJSON(),
        commandInstance.isAdminCommand
      );
      this.commands.push(commandJSON);
      this.commandObjects.push(commandInstance);
    });
  }

  private async registerCommandsWithDiscord(): Promise<void> {
    try {
      console.log("Registering Slash Commands!");

      const response: any = await this.rest.put(
        Routes.applicationCommands(this.clientId),
        { body: this.commands }
      );

      this.updateCommandIds(response);
    } catch (error) {
      console.error(`Error registering Slash Commands: ${error}`);
    }
  }

  private updateCommandIds(registeredCommands: any[]): void {
    registeredCommands.forEach((registeredCommand) => {
      const commandObject = this.commandObjects.find(
        (cmdObj) => cmdObj.data.name === registeredCommand.name
      );
      if (commandObject) {
        commandObject.commandId = registeredCommand.id;
        console.log(`cmdName: ${registeredCommand.name} - cmdId: ${registeredCommand.id}`);
      }
    });
  }

  private processAdminPermissions(commandJSON: any, isAdminCommand: boolean): any {
    if (isAdminCommand) {
      return {
        ...commandJSON,
        type: 1,
        default_member_permissions: "8", // Administrator permission
      };
    }
    return commandJSON;
  }
}