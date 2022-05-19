import { Client, ClientOptions, Collection, GuildMember, Intents } from 'discord.js';
import { Command, Event } from './interface/Types.js';
import { AudioResource, AudioPlayer } from "@discordjs/voice";
import { readdirSync } from 'fs';
import config from './Config';

export default class myClient extends Client {
    public commands: Collection<String, Command>;
    music: {
        volume: number;
        connection: any | null;
        player: AudioPlayer | null;
        resource: AudioResource | null;
        queue: Array<{
            url: string,
            title: string,
            length: string,
            thumbnail: string,
            authorname: string,
            author: GuildMember;
        }>;
        nowplaying: {
            url: string,
            title: string,
            length: string,
            thumbnail: string,
            authorname: string,
            author: GuildMember;
        } | undefined | null;
re: 0 | 1 | 2;
pause: boolean;
    } | null;

constructor(options: ClientOptions) {
    super(options);
    this.music = null;
    this.commands = new Collection();
    this.loadCommands();
    this.loadEvents();
};

    private loadCommands(): void {
    const commandFolders = readdirSync('./commands', { 'withFileTypes': true }).filter(i => i.isDirectory());
    commandFolders.forEach((f) => {
        let commandFiles = readdirSync('./commands/' + f.name).filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
        if (commandFiles.length > 25) throw new Error("명령어 타입은 25개를 넘길 수 없습니다.");
        commandFiles.forEach((c) => {
            const command = require('./commands/' + f.name + '/' + c) as { default: Command };
            command.default.type = f.name;
            this.commands.set(c.replace(".js", "").replace(".ts", ""), command.default);
        });
    });
};

    private loadEvents(): void {
    const eventFiles = readdirSync(`./events`).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
    for(let file of eventFiles) {
        if (file.replace(".js", "").replace(".ts", "") === "debug" && !config.debug) {
        } else {
            file = file.replace(".js", "").replace(".ts", "");
            const event = require(`./events/${file}`) as { default: Event };
            if (event.default.once) {
                this.once(file, (...args) => event.default.execute(this, ...args));
            } else {
                this.on(file, (...args) => event.default.execute(this, ...args));
            };
        }
    };
};
};

export const intents = Object.values(Intents.FLAGS);