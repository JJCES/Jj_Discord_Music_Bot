import { Command } from '../../interface/Types';
import search from "yt-search";
import { Message } from 'discord.js';

const command: Command = {
    name : ["유튜브 검색", "youtube-search"],
    description: "봇의 핑을 확인합니다.",
    dm: false,
    management: false,
    run: async (client, message, args) => {
        const searchmsg = await message.channel.send(`🔎 \`\`${args.join(" ")}\`\` 를(을) 검색 중입니다..`);
        search(args.join(" "), async (err, res) => {
            searchmsg.delete();
            let videos = res.videos.slice(0, 10);
            let resp = '';
            for (var i in videos) {
                resp += `**[${parseInt(i) + 1}]:** ${videos[i].title}\n`;
            }
            resp += `\n<@${message.author.id}> **\n\`1~${videos.length}\`**중 원하는 번호를 고르세요`
            const infomsg = await message.channel.send(`🔎 \`\`${args.join(" ")}\`\` 의 검색 결과\n${resp}`);
            const filter = (m: Message): boolean => {
                if (m.author.id === message.author.id) {
                    if (m.content.startsWith("c") || m.content.startsWith("$재생")) {
                        return true;
                    } else if (!isNaN(Number(m.content)) && Number(m.content) < videos.length + 1 && Number(m.content) > 0 && m.author.id == message.author.id) {
                        return true;
                    }
                }
                return false;
            }
            const collector = message.channel.createMessageCollector({ filter: filter });
            videos = videos;
            collector.once('collect', function (m) {
                infomsg.delete();
                if (m.content.toLocaleLowerCase().startsWith("!play")) {
                    message.reply("검색을 취소합니다")
                    return
                }
                if (m.content.startsWith("c")) {
                    message.reply("검색을 취소합니다")
                    return
                }
                if (m.content.startsWith("C")) {
                    message.reply("검색을 취소합니다")
                    return
                }
                const commandFile = client.commands.get('play')!;
                commandFile.run(client, message, [videos[parseInt(m.content) - 1].url]);
            });
        });
    }
};

export default command;