import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import { type Color, colors } from '@mcdata/data';

export default class Colors extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('colors')
            .setDescription('Shows information about Minecraft colors.')
            .addStringOption(option =>
                option.setName('color')
                    .setDescription('The color you want to see.')
                    .addChoices(
                        ...colors.data.map((color: Color) => {
                            return {
                                name: color.name,
                                value: color.name
                            }
                        })
                    )
            )
        );
    }

    async execute(client: any, interaction: any) {
        const color = interaction.options.getString('color');

        if (color) {
            const colorData = colors.data.find(x => x.name === color)!;
            const embed = new EmbedBuilder({
                title: colorData.name,
                description: `\`${colorData.tag}\``,
                thumbnail: {
                    url: client.config.icon
                },
                color: parseInt(colorData.hexCode.replace('#', ''), 16),
                footer: {
                    text: 'McData',
                    icon_url: client.config.icon
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Hex',
                        value: colorData.hexCode,
                        inline: true
                    },
                    {
                        name: 'Minecraft',
                        value: `\`${colorData.chatCode}\``,
                        inline: true
                    },
                    {
                        name: 'RGB',
                        value: colorData.motdCode,
                        inline: true
                    }
                ]
            })

            return interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder({
            title: 'Colors',
            thumbnail: {
                url: client.config.icon
            },
            color: client.colors.main,
            footer: {
                text: 'McData',
                icon_url: client.config.icon
            },
            timestamp: new Date(),
            description: colors.data.map((color: Color) => {
                return `\`${color.name}\``
            }).join(', ')
        })

        return interaction.reply({ embeds: [embed] });
    }
}