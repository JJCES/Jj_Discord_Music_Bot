import { Command } from '../../interface/Types';

const command: Command = {
    description: "봇의 핑을 확인합니다.",
    dm: true,
    management: false,
    run: (client, message, args) => {
        message.reply("Pong!");
    }
};

export default command;