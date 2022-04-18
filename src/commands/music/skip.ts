import { Command } from '../../interface/Types';

const command: Command = {
    description: "재생중인 곡을 멈추고 다음 곡으로 넘깁니다.",
    dm: false,
    management: false,
    run: (client, message, args) => {
        client.music!.resource?.playStream.emit("end");
        message.reply("스킵 요청이 완료되었습니다.");
    }
};

export default command;