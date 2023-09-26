const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const instruments = require('../../data/mc/instruments.json');

module.exports = {
    name: 'instruments',
    description: 'Get information about instrument(s), for noteblock purposes.',
    category: 'info',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'instrument',
            description: 'The instrument.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        let query = interaction.options.get('instrument')?.value;
        if (query) {
            let i = instruments.data.find(x =>
                x.name.toLowerCase() === query ||
                x.tag === query ||
                x.altNames.map(y => y.toLowerCase()).includes(query)
            );
            if (!i) return interaction.reply(client.embeds.fail('This instrument does not exist.'));

            let embed = new EmbedBuilder({
                title: `Instrument | ${i.name}`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Synonyms',
                        value: i.altNames.length > 0 ? `_${i.altNames.join(' • ')}_` : '`-`',
                        inline: false
                    },
                    {
                        name: 'Range',
                        value: i.range ?? '`-`',
                        inline: true
                    },
                    {
                        name: 'Materials',
                        value: i.materials.length > 0 ? i.materials.join(', ') + '\n\n _[`More info ↗`](https://minecraft.wiki/w/Materials#Blocks)_' : '`-`',
                        inline: true
                    },
                    {
                        name: 'Blocks',
                        value: i.blocks.length > 0 ? i.blocks.join(', ') : '`-`',
                        inline: true
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        } else {

            let arr = [];
            await instruments.data.forEach(val => arr.push(`- ${val.name} (\`${val.tag}\`)`));

            let embed = new EmbedBuilder({
                title: 'Instruments',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                description: arr.join('\n'),
                footer: client.config.footer,
                timestamp: Date.now()
            });

            return interaction.reply({ embeds: [embed] });

        }
    }
};
