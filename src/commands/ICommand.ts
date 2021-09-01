import { Message } from "discord.js"

export interface ICommand {
    readonly commandName: string;

    readonly commandAliases: string[];

    help(commandPrefix: string): string;

    run(parsedCommand: Message): Promise<void>;
}

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
}