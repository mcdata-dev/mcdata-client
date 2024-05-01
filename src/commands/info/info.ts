import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import { version } from '../../../package.json';

export default class Info extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('info')
            .setDescription('Shows information about the bot.')
        );
    }

    async execute(client: any, interaction: any) {
        const embed = new EmbedBuilder({
            title: 'Bot Information',
            description: `> _Minecraft data, in Discord._`,
            thumbnail: {
                url: client.config.icon
            },
            color: client.colors.main,
            fields: [
                {
                    name: 'Username',
                    value: client.user.username,
                    inline: true
                },
                {
                    name: 'Version',
                    value: `[v${version}](https://github.com/mcdata-dev/mcdata-client/releases/tag/v${version})`,
                    inline: true
                },
                {
                    name: 'Guilds',
                    value: client.guilds.cache.size,
                    inline: true
                },
                {
                    name: 'GitHub',
                    value: '[Open Link ↗](https://github.com/mcdata-dev)',
                    inline: true
                },
                {
                    name: 'Memory Usage',
                    value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                    inline: true
                },
                {
                    name: 'Developers',
                    value: `[Fyxren](https://github.com/Fyxren) & [HalloSouf](https://github.com/HalloSouf)`,
                    inline: true
                }
            ],
            footer: {
                text: 'McData',
                icon_url: client.config.icon
            },
            timestamp: new Date()
        })

        return interaction.reply({ embeds: [embed] });
    }
}