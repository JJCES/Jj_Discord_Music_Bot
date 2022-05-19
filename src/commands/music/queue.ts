import { MessageButton, MessageActionRow, MessageEmbed, Message } from 'discord.js';
import { Command } from '../../interface/Types';
import secToHHMSS from '../../Modules/secToHHMMSS';

const command: Command = {
    name : ["리스트", "대기열", "queue"],
    description: "신청받은 곡 리스트를 보여줍니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music?.nowplaying) return message.reply("재생중인 곡이 없습니다!");
        var page = 0
        const maxPage = Math.ceil(client.music.queue.length / 5);

        const getPage = (page: number, message: Message | null): string => {
            if (!client.music?.nowplaying) return "Error";
            let description = `> 재생중\n신청자 : ${client.music.nowplaying.author.nickname ?? client.music.nowplaying.author.user.username}\n${client.music.nowplaying.title}`
            for (let i = page; i <= client.music!.queue.length; i++) {
                let item = client.music!.queue[i - 1];
                description += `\n> \*\*${i}\*\*번곡\n신청자 : ${item.author.nickname ?? item.author.user.username}\n${item.title}[${secToHHMSS(item.length)}]`
            };
            if (message){
                message.embeds[0].description = description
                message.edit({embeds: [message.embeds[0]]});
            } 
            return description;
        }

        var embed = new MessageEmbed({
            title: "신청받은 곡 리스트",
            color: "BLURPLE",
            description: getPage(1, null),
            footer: {
                text: `페이지 : ${page + 1} | 마지막 페이지 : ${maxPage == 0 ? 1 : maxPage}`
            }
        });

        var buttons = new MessageActionRow().addComponents(
            new MessageButton({
                label: "◀️",
                style: "PRIMARY",
                customId: "Back",
                disabled: true
            }),
            new MessageButton({
                label: "🗑️",
                style: "PRIMARY",
                customId: "Delete"
            }),
            new MessageButton({
                label: "▶️",
                style: "PRIMARY",
                customId: "Front",
                disabled: page == maxPage ? true : false
            })
        );

        message.reply({ embeds: [embed], components: [buttons] }).then(m => {
            const filter = (i: { user: { id: string; }; }) => i.user.id === message.author.id;
            const collector = m.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 60000 });

            collector.on("collect", async i => {
                await i.deferReply({ ephemeral: false });

                switch (i.customId) {
                    case "Back":
                        page -= 1
                        if (page == 1) {
                            buttons.components[0].disabled = true
                        } else {
                            buttons.components[0].disabled = false
                        };
                        getPage(page, m);
                        m.edit({ embeds: [embed] });
                        await i.editReply({ content: "뒤로가기를 눌렀어용!" });
                        break;
                    case "Delete":
                        m.delete();
                        break;
                    case "Front":
                        page += 1
                        if (page == maxPage) {
                            buttons.components[2].disabled = true
                        } else {
                            buttons.components[2].disabled = false
                        };
                        getPage(page, m);
                        m.edit({ embeds: [embed] });
                        await i.editReply("앞으로 넘기기를 눌렀어용!");
                        break;
                };
            });

            collector.on('end', collected => {
                buttons.components.forEach(b => {
                    b.disabled = true;
                });
                embed.setFooter("10분이 지나 버튼을 누를 수 없습니다.");
                m.edit({ embeds: [embed], components: [buttons] })
            });
        });
    }
};

export default command;