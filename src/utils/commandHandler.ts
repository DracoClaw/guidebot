import { Message } from "discord.js";
import { ICommand } from "../commands/ICommand";

export default class CommandHandler {
    private commands: ICommand[];

    private readonly prefix: string;

    constructor(prefix: string) {
        const commandClasses = ICommand.GetImplementations();

        this.commands = commandClasses.map(commandClass => new commandClass());
        this.prefix = prefix;
    }

    async handleMessage(message: Message): Promise<void> {
        if (message.author.bot || !this.isCommand(message)) {
            return;
        }
        
        message.reply(`Message from <@${message.author.id}> received.`);


    }

    isCommand(message: Message): boolean {
        return message.content.startsWith(this.prefix);
    }
}