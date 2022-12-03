const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const formatCodes = require('../../data/mc/formatCodes.json');

module.exports = {
    name: 'formatcodes',
    description: 'Get information about formatcode(s).',
    category: 'info',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'formatcode',
            description: 'The formatcode.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('formatcode')?.value;

        if (query) {
            let fc = formatCodes.data.find(x =>
                x.name.toLowerCase() === query ||
                x.tag === query ||
                x.chatCode === query ||
                x.motdCode === query ||
                `\\` + x.motdCode === query);
            if (!fc) return interaction.reply(client.embeds.fail('This formatcode does not exist.'));

            let embed = new EmbedBuilder({
                title: `FormatCode | ${fc.name}`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'ChatCode',
                        value: fc.chatCode,
                        inline: true
                    },
                    {
                        name: 'MotdCode',
                        value: `\\` + fc.motdCode,
                        inline: true
                    },
                    {
                        name: 'Example',
                        value: fc.example ? fc.example.replace('{TEXT}', interaction.user.username || 'Test') : '`-`',
                        inline: true
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        } else {

            let arr = [];
            await formatCodes.data.forEach(val => arr.push(`\`${val.name}\``));

            let embed = new EmbedBuilder({
                title: `FormatCodes`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                description: arr.join(', '),
                footer: client.config.footer,
                timestamp: Date.now()
            });

            return interaction.reply({ embeds: [embed] });

        }
    }
};