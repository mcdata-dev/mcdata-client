const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { ItemCache } = require('../../managers/CacheManager');
const Axios = require('axios');

module.exports = {
    name: 'item',
    description: "Get information about an item.",
    category: 'info',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'item',
            description: 'Choose an item.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('item').value;
        let cached = ItemCache.find(x => query === x.name || query === x.text_type || query === `${x.type}:${x.meta}` || query === x.type);
        if (cached) {
            let embed = new EmbedBuilder({
                title: `Item | ${cached.name}`,
                description: `> _This will be expanded with more data in the future._`,
                url: 'https://minecraft-ids.grahamedgecombe.com/',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Text Type',
                        value: `\`${cached.text_type}\``,
                        inline: true
                    },
                    {
                        name: 'ID',
                        value: `${cached.type}:${cached.meta}`,
                        inline: true
                    },
                    {
                        name: 'Type',
                        value: cached.type,
                        inline: true
                    },
                ]
            });
            return interaction.reply({ embeds: [embed] });
        }

        Axios.get('https://minecraft-ids.grahamedgecombe.com/items.json').then((res) => {
            let data = res.data.find(x => query === x.name || query === x.text_type || query === `${x.type}:${x.meta}` || query === x.type);
            if (!data) return interaction.reply(client.embeds.fail('This item couldn\'t be found.'));

            ItemCache.set(data.name, data);
            let embed = new EmbedBuilder({
                title: `Item | ${data.name}`,
                description: `> _This will be expanded with more data in the future._`,
                url: 'https://minecraft-ids.grahamedgecombe.com/',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Text Type',
                        value: `\`${data.text_type}\``,
                        inline: true
                    },
                    {
                        name: 'ID',
                        value: `${data.type}:${data.meta}`,
                        inline: true
                    },
                    {
                        name: 'Type',
                        value: data.type,
                        inline: true
                    },
                ]
            });
            return interaction.reply({ embeds: [embed] });
        }).catch(e => {
            client.logger.error(`item.js`, `Error while trying to fetch the items: ${e}`);
            return interaction.reply(client.embeds.error);
        });
    }
};