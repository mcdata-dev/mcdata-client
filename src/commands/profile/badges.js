const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const badges = require('../../data/config/badges');

module.exports = {
    name: 'badges',
    description: 'Get information about badges.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'badge',
            description: 'A badge.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('badge')?.value?.toLowerCase();

        if (query) {
            let badge = badges.data.find(x =>
                x.name.toLowerCase() === query ||
                x.id === query ||
                x.level.toString() === query
            );
            if (!badge) return interaction.reply(client.embeds.fail('This badge does not exist.'));
            let count = await client.prisma.badge.count({
                where: { badge: badge.id }
            });
            console.log(count);
            let embed = new EmbedBuilder({
                title: `Badge | ${badge.name}`,
                color: client.c.main,
                thumbnail: {
                    url: `https://cdn.discordapp.com/emojis/${badge.badge.split(':')[2].slice(0, -1)}.webp?size=2048&quality=lossless`
                },
                description: `> _${badge.desc}_`,
                fields: [
                    {
                        name: 'ID',
                        value: badge.id,
                        inline: true
                    },
                    {
                        name: 'Level',
                        value: badge.level.toString(),
                        inline: true
                    },
                    {
                        name: 'Count',
                        value: count === 1 ? '1 user' : `${count} users`,
                        inline: true
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        } else {
            let embed = new EmbedBuilder({
                title: `Amount`,
                description: '> _User \`/badges [badge]\` to get a little more information._',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                }
            });
            badges.data.forEach(val => embed.addFields({ name: `${val.badge} - ${val.name}`, value: val.desc, inline: true }));
            return interaction.reply({ embeds: [embed] });

        }
    }
};