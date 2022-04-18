import { MessageEmbed } from 'discord.js';
import { Command } from '../../interface/Types';

const command: Command = {
    description: "봇 관리자가 명령어를 테스트할때 사용됩니다.",
    usage: "코드",
    dm: true,
    management: false,
    run: async (client, message, args) => {
        let code = args.join(' ');
        let out = await eval(code);
        if (typeof out !== 'string')
            out = require("util").inspect(out);
        try {
            let embed = new MessageEmbed({
                title: "결과",
                description: '\`\`\`js\n' + (out.length > 1990 ? out.slice(0, 1900) + '\n...more' + (out.length - 1900) : out) + '\`\`\`',
                fields: [
                    {
                        name: "코드",
                        value: '\`\`\`js\n' + (code.length > 1014 ? code.slice(0, 1000) + '\n...more' + (code.length - 1000) : code + '') + '\`\`\`'
                    }
                ]
            });
            message.reply({ embeds: [embed] });
        } catch (e: any) {
            let embed = new MessageEmbed({
                title: "에러 발생",
                description: '\`\`\`js\n' + (e.length > 1990 ? e.slice(0, 1900) + '\n...more' + (e.length - 1900) : e + '') + '\`\`\`',
                fields: [
                    {
                        name: "코드",
                        value: '\`\`\`js\n' + (code.length > 1014 ? code.slice(0, 1000) + '\n...more' + (code.length - 1000) : code + '') + '\`\`\`'
                    }
                ]
            });
            message.reply({ embeds: [embed] });
        };
    }
};

export default command;