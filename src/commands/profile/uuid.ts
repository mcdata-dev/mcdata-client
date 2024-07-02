import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';
import PlayerManager from '../../managers/PlayerManager';

export default class Uuid extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('uuid')
            .setDescription('Get the UUID of a player.')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('username')
                    .setDescription('Get the UUID of a username.')
                    .addStringOption(option =>
                        option
                            .setName('username')
                            .setDescription('The username to get the UUID of.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('user')
                    .setDescription('Get the UUID of the account from a user.')
                    .addUserOption(option =>
                        option
                            .setName('user')
                            .setDescription('The user to get the UUID of.')
                    )
            )
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'username':
                await this.username(client, interaction);
                break;
            case 'user':
                await this.user(client, interaction);
                break;
        }
    }

    async username(client: McClient, interaction: ChatInputCommandInteraction) {

        const username = interaction.options.getString('username', true);
        const player = new PlayerManager(username);
        const account = await player.getAccount();

        if ('error' in account) {
            const embed = new EmbedBuilder({
                description: client.emotes.fail + account.message,
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        let embed = new EmbedBuilder({
            title: `Username >> UUID`,
            description: `Account: **${account.name}**`,
            fields: [
                {
                    name: 'UUID',
                    value: account.id,
                    inline: true
                },
                {
                    name: 'Cached',
                    value: '`-`',
                    inline: true
                }
            ],
            thumbnail: {
                url: player.getHelm
            },
            color: client.colors.main
        });

        return interaction.reply({ embeds: [embed] });
    }

    async user(client: McClient, interaction: ChatInputCommandInteraction) {

        const user = interaction.options.getUser('user') || interaction.user;

        // Get the main account from the user 
        const account = await client.prisma.minecraftAccount.findFirst({
            where: {
                user_id: user.id,
                main: true
            }
        })

        if (!account) {
            let noAccountEmbed = new EmbedBuilder({
                description: client.emotes.fail + `**${user}** does not have a linked account.`,
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [noAccountEmbed] });
        }

        let player = new PlayerManager(account.uuid);
        let profile = await player.getAccount();

        if ('error' in profile) {
            let errorEmbed = new EmbedBuilder({
                description: client.emotes.fail + profile.message,
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [errorEmbed] });
        }

        let embed = new EmbedBuilder({
            title: `Username >> UUID`,
            description: `Main Account: **${profile.name}**`,
            fields: [
                {
                    name: 'UUID',
                    value: account.uuid,
                    inline: true
                },
                {
                    name: 'Cached',
                    value: '`-`',
                    inline: true
                }
            ],
            thumbnail: {
                url: player.getHelm
            },
            color: client.colors.main
        });
        return interaction.reply({ embeds: [embed] });
    }


}