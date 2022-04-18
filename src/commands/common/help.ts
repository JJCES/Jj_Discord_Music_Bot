import { Command } from '../../interface/Types';
import { MessageEmbed } from 'discord.js';
import config from '../../Config';

const command: Command = {
    description: "봇의 명령어들에 대해 설명해줍니다.",
    usage: "명령어",
    dm: true,
    management: false,
    run: (client, message, args) => {
        let embed: MessageEmbed;
        switch (args[0]) {
            case null:
            case undefined:
                console.log(1)
                embed = new MessageEmbed({
                    title: "명령어 리스트",
                    description: "명령어에 대한 정보를 보시려면 \`" + config.prefix + "help 명령어\`를 사용해주세요!",
                    color: "BLURPLE"
                });

                client.commands.forEach(t => {
                    if (t.name != "유튜브 검색.js") {
                        let type = '';
                        switch (t.type) {
                            case undefined:
                            case null:
                                type = 'None Type';
                                break;
                            default:
                                type = t.type;
                                break;
                        };
                        let field = embed.fields.find(i => i.name == type);
                        if (field) {
                            field.value += ', ' + t.name?.replace('.ts', '').replace('.js', '');
                        } else {
                            embed.fields.push({ name: type, value: t.name!.replace('.ts', '').replace('.js', ''), inline: false });
                        };
                    };
                });

                message.reply({ embeds: [embed] });
                break;
            default:
                let command = client.commands.get(args[0]);
                if (!command) return message.reply("없는 명령어입니다.");
                embed = new MessageEmbed({
                    title: command.name,
                    description: command.description,
                    color: "BLURPLE",
                    fields: [
                        {
                            name: "사용법",
                            value: config.prefix + command.name?.replace('.js', '').replace('.ts', '') + ' ' + (command.usage ?? "")
                        },
                        {
                            name: "명령어 타입",
                            value: command.type!,
                            inline: true
                        },
                        {
                            name: "관리자 권한 요청 여부",
                            value: command.management ? 'O' : 'X',
                            inline: true
                        },
                        {
                            name: "DM에서 사용 가능 여부",
                            value: command.dm ? 'O' : 'X',
                            inline: true
                        }
                    ]
                });
                message.reply({ embeds: [embed] });
                break;
        }
    }
};

export default command;