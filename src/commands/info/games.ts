import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import { type Game, games } from '@mcdata/data';
import McClient from '../../client/Client';

const statusMapping = {
    'active': '`🟢` Released',
    'upcoming': '`🟡` Upcoming',
    'discontinued': '`🔵` Discontinued'
}

export default class Games extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('games')
            .setDescription('Shows information about Minecraft games.')
            .addStringOption(option =>
                option.setName('game')
                    .setDescription('The game to get information about.')
                    .addChoices(
                        ...games.data.map((game: Game) => {
                            return {
                                name: game.name,
                                value: game.tag
                            }
                        })
                    )
            )
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const game = interaction.options.getString('game');

        if (game) {
            const gameData = games.data.find(x => x.tag === game)!;
            const embed = new EmbedBuilder({
                title: `Games | ${gameData.name}`,
                description: `> _${gameData.description}_`,
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
                        name: 'Editions',
                        value: gameData.editions.length > 0 ? gameData.editions.map((edition: string) => { return `\`${edition}\`` }).join(', ') : '`-`',
                        inline: true
                    },
                    {
                        name: 'Official Release',
                        value: gameData.officialRelease,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: statusMapping[gameData.status],
                        inline: true
                    }
                ]
            })

            return interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder({
            title: 'Games',
            thumbnail: {
                url: client.config.icon
            },
            color: client.colors.main,
            footer: {
                text: 'McData',
                icon_url: client.config.icon
            },
            timestamp: new Date(),
            description: games.data.map((game: Game) => {
                return `\`${game.name}\``
            }).join(', ')
        })

        return interaction.reply({ embeds: [embed] });
    }
}