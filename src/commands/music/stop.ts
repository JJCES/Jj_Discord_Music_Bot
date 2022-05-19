import { Command } from '../../interface/Types';

const command: Command = {
    name : ["종료", "끄기", "stop"],
    description: "재생중인 곡을 멈추고 봇을 종료합니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music?.nowplaying) return message.reply("재생중인 곡이 없습니다!");
        client.music.queue = [];
        client.music!.resource?.playStream.emit("end");
    }
};

export default command;