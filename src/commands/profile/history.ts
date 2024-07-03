import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';

export default class History extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('history')
            .setDescription('View the name history.')
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder({
            title: 'Deprecated',
            description: '> Mojang removed the data endpoint on "_improve player safety and data privacy_".',
            thumbnail: {
                url: client.config.icon
            },
            color: client.colors.fail,
            fields: [
                {
                    name: 'What can I do?',
                    value: 'You can still view the name history of a player by visiting their profile on [namemc.com](https://namemc.com).',
                    inline: true
                },
                {
                    name: 'Since when?',
                    value: '<t:1663053900:R>',
                    inline: true
                }
            ],
            footer: {
                text: 'McData',
                iconURL: client.config.icon
            },
            timestamp: new Date()
        })

        return interaction.reply({ embeds: [embed] });
    }
}