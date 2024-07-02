import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';

export default class Ping extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('description')
            .setDescription('Configure your profile description.')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('set')
                    .setDescription('Set your profile description.')
                    .addStringOption(option =>
                        option.setName('description')
                            .setDescription('The description to set.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('remove')
                    .setDescription('Remove your profile description.')
            )
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'set':
                const record = await client.prisma.user.update({
                    where: {
                        id: interaction.user.id
                    },
                    data: {
                        description: interaction.options.getString('description')
                    }
                })

                let setEmbed = new EmbedBuilder({
                    description: client.emotes.done + `Your description has been set to: "${record.description}".`,
                    color: client.colors.done
                })

                return interaction.reply({ embeds: [setEmbed] });

            case 'remove':
                await client.prisma.user.update({
                    where: {
                        id: interaction.user.id
                    },
                    data: {
                        description: null
                    }
                })

                let removeEmbed = new EmbedBuilder({
                    description: client.emotes.done + `Your description has been removed.`,
                    color: client.colors.done
                })

                return interaction.reply({ embeds: [removeEmbed] });
        }
    }
}