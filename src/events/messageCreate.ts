import { Event } from '../interface/Types';
import { Message } from 'discord.js';
import config from '../Config';


const event: Event = {
    once: false,
    execute: (client, message: Message) => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        let args = message.content.slice(config.prefix.length).trim().split(" ");
        let command = args.shift()!.toLocaleLowerCase();
        try {
            let file = client.commands.get(command)!;
            if (message.channel.type === "DM" && !file.dm || file.type === "owner" && message.author.id !== config.owner || message.member?.permissions.has("ADMINISTRATOR") && file.management) return;
            //return message.reply("명령어 사용법이 잘못되었습니다.\n" + config.prefix + 'help ' + command + " 를 통해 명령어 사용법에 대해 확인해보세요.");r
            file.run(client, message, args);
        } catch (e) {
            console.log(e);
        };
    }
};

export default event;