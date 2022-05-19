import { Command } from '../../interface/Types';

const command: Command = {
    name: ["스킵", "skip"],
    description: "재생중인 곡을 멈추고 다음 곡으로 넘깁니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music?.nowplaying) return message.reply("재생중인 곡이 없습니다!");
        client.music!.resource?.playStream.emit("end");
        message.reply("스킵 요청이 완료되었습니다.");
    }
};

export default command;