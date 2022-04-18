import { Command } from '../../interface/Types';
import ytdl, { validateURL, getInfo } from 'ytdl-core';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import secToHHMSS from '../../Modules/secToHHMMSS';

const command: Command = {
    description: "음악을 재생합니다.",
    dm: false,
    usage:"{노래의 제목 | Youtube_URL}",
    management: false,
    run: async (client, message, args) => {
        if (!message.member?.voice.channel!.isVoice() && !message.member?.voice.channelId) return message.reply('🎶 통화방에 먼저 들어가서 사용해주세요!');
        if (message.member.voice.channelId !== message.guild!.me?.voice.channelId && message.guild!.me?.voice.channelId) return message.reply("봇이 이미 통화방에서 노래를 틀고 있습니다!\n봇이 있는 곳에서 신청을 해주세요!");
        if (args.length === 0) return message.reply("🎶 링크를 적어주세요");
        let validate = validateURL(args[0]);
        if (!validate) {
            let commandFile = client.commands.get('유튜브 검색')!;
            return commandFile.run(client, message, args)
        }
        let info = await getInfo(args[0]);
        if (!client.music) {
            client.music = {
                volume: 50,
                connection: null,
                player: createAudioPlayer(),
                resource: null,
                queue: [],
                nowplaying: null,
                re: 0,
                pause: false
            }
        };
        client.music.connection = joinVoiceChannel({
            channelId: message.member.voice.channelId!,
            guildId: message.guild!.id,
            adapterCreator: message.guild!.voiceAdapterCreator,
        });
        const nowplaying = client.music.nowplaying;
        if (!client.music.queue) client.music.queue = [];
        const item = {
            url: info.videoDetails.video_url,
            title: info.videoDetails.title,
            length: info.videoDetails.lengthSeconds,
            thumbnail: `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`,
            authorname: info.videoDetails.author.name,
            author: message.author
        }
        client.music.queue.push(item)
        if (nowplaying && client.music.queue.length >= 1) message.reply(`<@${message.author.id}>, 🎶 당신의 신청곡: **${item.title}** \`\`[${secToHHMSS(item.length)}]\`\` 이 대기열 ${client.music.queue.length} 에 위치되었습니다!`);
        playItem();
        async function playItem() {
            if (!nowplaying && client.music?.queue[0]) {
                var playitem = client.music.queue.shift();
                client.music!.nowplaying = playitem;
                client.music!.resource = createAudioResource(ytdl(playitem.url, {
                    highWaterMark: 1 << 25,
                    filter: "audioonly"
                }), {
                    inlineVolume: true
                });
                client.music!.resource.volume?.setVolume(client.music!.volume / 100);
                client.music!.player?.play(client.music!.resource);
                client.music!.connection.subscribe(client.music!.player);
                client.music!.resource?.playStream.once("end", () => {
                    if (client.music!.re == 1) {
                        client.music?.queue.push(client.music!.nowplaying)
                        client.music!.nowplaying = null;
                    } else if (client.music!.re == 2) {
                        client.music?.queue.unshift(playitem);
                        client.music!.nowplaying = null;
                    }
                    playItem();
                });
                client.music!.resource.volume?.setVolume(client.music!.volume / 100);
                message.channel.send(`🎶 현재 재생중인 곡 : **${playitem.title}** \`\`[${secToHHMSS(playitem.length)}]\`\``);
            } else if (client.music?.queue.length === 0) {
                client.music!.nowplaying = null;
                client.music!.connection.disconnect();
                client.music!.connection = null
                if (client.music!.pause === false) {
                    message.channel.send(`🎶 노래 재생이 끝나고, 보이스 채널에서 나갔습니다!`);
                } else {
                    client.music!.pause = false
                }
            }
        }
    }
};

export default command;