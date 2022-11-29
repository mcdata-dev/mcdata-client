const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const colors = require('../../data/mc/colors.json');

module.exports = {
    name: 'colors',
    description: 'Get information about color(s).',
    category: 'info',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'color',
            description: 'The color.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('color')?.value?.toLowerCase();

        if (query) {
            let c = colors.data.find(x =>
                x.name.toLowerCase() === query ||
                x.tag === query ||
                x.chatCode === query ||
                x.motdCode === query ||
                `\\` + x.motdCode === query ||
                x.hexCode === query ||
                `#` + x.hexCode === query);
            if (!c) return interaction.reply(client.embeds.fail('This color does not exist.'));

            let embed = new EmbedBuilder({
                title: `Color | ${c.name} (\`${c.tag}\`)`,
                color: parseInt(c.hexCode.replace('#', '0x')),
                thumbnail: {
                    url: client.config.logo
                },
                fields: [
                    {
                        name: 'ChatCode',
                        value: c.chatCode,
                        inline: true
                    },
                    {
                        name: 'MotdCode',
                        value: `\\` + c.motdCode,
                        inline: true
                    },
                    {
                        name: 'HexCode',
                        value: c.hexCode,
                        inline: true
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        } else {

            let arr = [];
            await colors.data.forEach(val => arr.push(`\`${val.name}\``));

            let embed = new EmbedBuilder({
                title: `Colors`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                description: arr.join(', ')
            });

            return interaction.reply({ embeds: [embed] });

        }
    }
};