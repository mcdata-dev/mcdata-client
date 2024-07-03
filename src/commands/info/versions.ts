import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';
import { Version, versions } from '@mcdata/data';

export default class Versions extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('versions')
            .setDescription('Shows information about Minecraft versions.')
            .addStringOption(option =>
                option
                    .setName('version')
                    .setDescription('The version you want to see.')
            )
        )
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {

        let version = interaction.options.getString('version');

        if (version) {

            // If the versions ends with .0, like 1.10.0, remove the .0. But if it's like 1.0, keep it. If it's 1.0.0, remove the last .0
            if (version.endsWith('.0') && version.split('.').length === 3) {
                version = version.slice(0, -2);
            }

            const versionData = versions.data.find(x => x.version === version);

            if (!versionData) {
                let embed = new EmbedBuilder({
                    description: client.emotes.fail + 'That version does not exist.',
                    color: client.colors.fail
                })

                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder({
                title: `Version | ${versionData.version}`,
                thumbnail: {
                    url: client.config.icon
                },
                color: client.colors.main,
                footer: {
                    text: 'McData',
                    icon_url: client.config.icon
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Major Version',
                        value: versionData.major,
                        inline: true
                    },
                    {
                        name: 'Major Name',
                        value: versionData.majorName ?? '`-`',
                        inline: true
                    },
                    {
                        name: 'Release Date',
                        value: versionData.release ?? 'Planned',
                        inline: true
                    }
                ]
            })

            return interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder({
            title: 'Versions',
            thumbnail: {
                url: client.config.icon
            },
            color: client.colors.main,
            footer: {
                text: 'McData',
                icon_url: client.config.icon
            },
            timestamp: new Date(),
            description: versions.data.map((version: Version) => {
                if (!version.release) return `~~\`${version.version}\`~~`
                return `\`${version.version}\``
            }).join(', ')
        })

        return interaction.reply({ embeds: [embed] });

    }
}