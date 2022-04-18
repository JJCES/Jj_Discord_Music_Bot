import { MessageEmbed } from 'discord.js';
import { Command } from '../../interface/Types';
import secToHHMSS from '../../Modules/secToHHMMSS';

const command: Command = {
    description: "현재 재생중인 곡의 정보를 보여줍니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music?.nowplaying) return message.reply("재생중인 곡이 없습니다!");
        let item = client.music.nowplaying;
        let embed = new MessageEmbed({
            title: item.title,
            description: "\*\*업로더\*\* : " + item.authorname + "\n\n영상 길이 : " + secToHHMSS(item.length),
            color: "BLURPLE",
            author: {
                icon_url: item.author.displayAvatarURL(),
                name: item.author.tag
            },
            thumbnail: {
                url: item.thumbnail
            }
        });
        message.reply({ embeds: [embed] });
    }
};


export default command;