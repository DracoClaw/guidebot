import { CommandInteraction, Message } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders"

export interface ICommand {
    commandId: string;

    data: SlashCommandBuilder;

    execute(interaction: CommandInteraction): void
}
/* 
export namespace ICommand {
    type Constructor<T> = {
        new(...args: any[]): T;
        readonly prototype: T;
    }

    const implementations: Constructor<ICommand>[] = [];
    export function GetImplementations(): Constructor<ICommand>[] {
        return implementations;
    }
    export function Register<T extends Constructor<ICommand>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }
} */