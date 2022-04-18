import { Message, Awaitable, CommandInteraction } from 'discord.js';
import Client from '../Class';
import { APIApplicationCommandOption } from 'discord-api-types/v9';

export interface Command {
    name?: string;
    description: string;
    usage?: string;
    dm: boolean;
    management: boolean;
    type?: string;
    run: (client: Client, message: Message, args: string[]) => void;
};

export interface InteractionCommand {
    [key: string]: string | any;
    name?: string;
    description: string;
    options?: APIApplicationCommandOption[];
    default_permission?: boolean | undefined;
    type?: number;
    guildId?: string;
    run?: (client: Client, interaction: CommandInteraction) => void;
};

export interface InteractionCommandsHandle {
    interactions: InteractionCommand[];
    commands: InteractionCommand[];
};

export interface Event {
    once: boolean;
    execute: (client: Client, ...args: any) => Awaitable<void>;
};