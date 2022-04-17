import { Command } from '../../interface/Types';

const command: Command = {
    description: "음악의 볼륨을 수정합니다.\n기본 볼륨 : 50",
    usage: "{0~150}",
    dm: false,
    management: false,
    run: (client, message, args) => {
        if (!client.music!.resource?.volume) return message.reply("봇이 음악을 재생중인지 확인해주세요.");
        let volume = Number(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 150) return message.reply("지정할 수 없는 볼륨입니다.");
        client.music!.volume = volume;
        client.music!.resource.volume.setVolume(client.music!.volume / 100);
        message.reply(`볼륨을 ${volume}으로 설정했습니다.`);
    }
};

export default command;