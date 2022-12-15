const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const versions = require('../../data/mc/versions.json');

module.exports = {
    name: 'versions',
    description: 'Get informations about version(s).',
    category: 'info',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'version',
            description: 'The Minecraft version.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('version')?.value;

        if (query) {
            let v = versions.data.find(x => x.version === query);
            if (!v) return interaction.reply(client.embeds.fail('This version does not exist.'));

            let embed = new EmbedBuilder({
                title: `Version | ${query}`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Major',
                        value: v.major,
                        inline: true
                    },
                    {
                        name: 'Major Name',
                        value: v.majorName,
                        inline: true
                    },
                    {
                        name: 'Release',
                        value: v.planned ? `Planned: ${v.planned}` : v.release,
                        inline: true
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        } else {

            let arr = [];
            await versions.data.forEach(val => {
                if (val.planned) arr.push(`_\`${val.version}*\`_`);
                else arr.push(`\`${val.version}\``);
            });

            let embed = new EmbedBuilder({
                title: 'Versions',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                description: '> _Excl. pre-releases etc.\n> * = Not yet released_',
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'List',
                        value: arr.join(', ')
                    }
                ]
            });

            return interaction.reply({ embeds: [embed] });

        }
    }
};
