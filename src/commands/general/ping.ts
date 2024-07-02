import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';

export default class Ping extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Pong.')
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder({
            title: 'Pong!',
            description: `Latency is ${Date.now() - interaction.createdTimestamp}ms.`
        })

        return interaction.reply({ embeds: [embed] });
    }
}