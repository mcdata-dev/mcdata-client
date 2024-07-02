import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';
import FlagManager from '../../managers/FlagManager';
import PlayerManager from '../../managers/PlayerManager';

const flagToBadgeMapping = {
    DEVELOPER: '<:mc_dev:1046520897709817927>',
    MODERATOR: '<:mc_mod:1046521032980320367>',
    SUPPORTER: '<:mc_donator:1046521029075406960>',
    FRIEND: '<:mc_friend:1046521030627299378>'
} as any;

export default class Profile extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('profile')
            .setDescription('View a profile.')
            .addUserOption(option => option.setName('user').setDescription('The user to view.'))
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const profile = await client.prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                accounts: {
                    where: {
                        main: true
                    }
                }
            }
        });

        if (!profile) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'No profile found for this user.',
                color: client.colors.fail
            })
            return interaction.reply({ embeds: [embed] });
        }

        const player = new PlayerManager(profile?.accounts[0]?.uuid);
        const flags = new FlagManager(profile.flags);
        const badges: string[] = [];
        if (profile.flags > 0) flags.list().forEach((flag: string) => badges.push(flagToBadgeMapping[flag]));

        let accountName;
        let account = await player.getAccount();
        if ('error' in account) {
            accountName = '`❌ - /account add`';
        } else {
            accountName = account.name;
        }

        let embed = new EmbedBuilder({
            title: `Profile | ${user.globalName}`,
            description: profile.description || '_No description set._',
            fields: [
                {
                    name: 'Minecraft Username',
                    value: accountName,
                    inline: true
                },
                {
                    name: 'Badges',
                    value: badges.length > 0 ? badges.join(' ') : '-',
                    inline: true,
                }
            ],
            color: client.colors.main,
            thumbnail: {
                url: player ? player.getHelm : user.displayAvatarURL({ size: 512 })
            },
            timestamp: new Date(),
            footer: {
                text: 'McData',
                icon_url: client.config.icon
            },
        })

        return interaction.reply({ embeds: [embed] });
    }
}