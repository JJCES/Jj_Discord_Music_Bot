import { MessageButton, MessageActionRow, MessageEmbed } from 'discord.js';
import { Command } from '../../interface/Types';
import secToHHMSS from '../../Modules/secToHHMMSS';

const command: Command = {
    description: "신청받은 곡 리스트를 보여줍니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music?.nowplaying) return message.reply("재생중인 곡이 없습니다!");
        let page = 0
        let maxPage = Math.ceil(client.music.queue.length / 5);
        const embed = new MessageEmbed({
            title: "신청받은 곡 리스트",
            color: "BLURPLE",
            description: `> 재생중 [${client.music.nowplaying.author.nickname ?? client.music.nowplaying.author.user.username}]\n${client.music.nowplaying.title}`,
            footer: {
                text: `페이지 : ${page + 1} | 마지막 페이지 : ${maxPage == 0 ? 1 : maxPage}`
            }
        });

        for (let i = 1; i < client.music.queue.length; i++) {
            let item = client.music.queue[i];
            embed.description += `\n> ${i} [${item.author.nickname ?? item.author.user.username}]\n${item.title}[${secToHHMSS(item.length)}]`
        };

        const buttons = new MessageActionRow().addComponents(
            new MessageButton({
                label: "◀️",
                style: "PRIMARY",
                customId: "Back"
            }),
            new MessageButton({
                label: "🗑️",
                style: "PRIMARY",
                customId: "Delete"
            }),
            new MessageButton({
                label: "▶️",
                style: "PRIMARY",
                customId: "Front"
            })
        );

        message.reply({ embeds: [embed], components: [buttons] }).then(m => {
            const filter = (i: { user: { id: string; }; }) => i.user.id === message.author.id;
            const collector = m.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 60000 });

            collector.on("collect", async i => {
                await i.deferReply({ ephemeral: false });
                // await wait.setTimeout(4000);
                switch (i.customId) {
                    case "Back":
                        await i.editReply({ content: "뒤로가기를 눌렀어용!" })
                        break;
                    case "Delete":
                        m.delete();
                        break;
                    case "Front":
                        await i.editReply("앞으로 넘기기를 눌렀어용!")
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