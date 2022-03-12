import Commands from "../commands";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ICommand } from "../commands/ICommand";

export class CommandHandler {

    clientId: string = 'process.env.APP_ID';

    commands: any[] = new Array();

    commandObjects: ICommand[] = new Array();

    constructor(clientId: string) {
        this.clientId = clientId;
    }

    async registerCommands(): Promise<void> {
        Commands.forEach((command) => {
            let commandInstance = new command();
            this.commands.push(commandInstance.data.toJSON());
            this.commandObjects.push(commandInstance);
        });

        let token = 'process.env.BOT_TOKEN'
        let rest = new REST({ version: "9" }).setToken(token);

        try {
            console.log("Registering Slash Commands!");

            await rest.put(
                Routes.applicationCommands(this.clientId),
                { body: this.commands }
            ).then((response: any) => {
                const registeredCommands: any[] = response;

                this.commands.forEach((command) => {
                    const cmdId:string = registeredCommands.find((registeredCommand) => registeredCommand.name === command.name).id;
                    console.log(`cmdName: ${command.name} - cmdId: ${cmdId}`);
                    const commandObject = this.commandObjects.find((cmdObj) => cmdObj.data.name === command.name);
                    if (commandObject) commandObject.commandId = cmdId;
                });
            });
        } catch(error) {
            console.error(`Error registering Slash Commands: ${error}`);
        }
    }
}