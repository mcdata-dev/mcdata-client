import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';
import PlayerManager from '../../managers/PlayerManager';

export default class Skin extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('skin')
            .setDescription('View a skin.')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('head')
                    .setDescription('View a head.')
                    .addStringOption(option =>
                        option
                            .setName('username')
                            .setDescription('The username of the player.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('body')
                    .setDescription('View a body.')
                    .addStringOption(option =>
                        option
                            .setName('username')
                            .setDescription('The username of the player.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('downloadready')
                    .setDescription('View a download ready skin.')
                    .addStringOption(option =>
                        option
                            .setName('username')
                            .setDescription('The username of the player.')
                            .setRequired(true)
                    )
            )
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        const username = interaction.options.getString('username');
        const player = new PlayerManager(username!);

        let embed = new EmbedBuilder({
            title: `Skin | ${username}`,
            color: client.colors.main,
            timestamp: new Date(),
            footer: {
                text: `McData`,
                iconURL: client.config.icon
            }
        });

        switch (subcommand) {
            case 'head':
                embed.setImage(player.getHead);
                return interaction.reply({ embeds: [embed] });
            case 'body':
                embed.setImage(player.getBody);
                return interaction.reply({ embeds: [embed] });
            case 'downloadready':
                embed.setImage(player.getDownloadReady);
                return interaction.reply({ embeds: [embed] });
        }
    }
}