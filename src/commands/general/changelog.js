const Axios = require('axios');
const moment = require('moment');
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { ChangelogCache } = require('../../managers/CacheManager');

module.exports = {
    name: 'changelog',
    description: 'Get the changelog of the current version.',
    category: 'general',
    cooldown: 5000,
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        let cl;
        let cached = ChangelogCache.get('latest');
        if (cached) {
            cl = cached;
        } else {
            const { status, data } = await Axios.get(`https://api.github.com/repos/McData-Development/McData/releases/latest`);
            if (status !== 200) {
                client.logger.error(`changelog.js`, `Error while fetching latest release.\nStatus:${status}\nData:`, data);
                return interaction.reply(client.embeds.error);
            } else {
                ChangelogCache.set('latest', data);
                cl = data;
            }
        }

        let embed = new EmbedBuilder({
            title: `Changelog | ${cl.name.replace('\n', '')} (\`${cl.tag_name}\`)`,
            color: client.c.main,
            thumbnail: {
                url: client.config.logo
            },
            footer: client.config.footer,
            timestamp: Date.now(),
            description: cl.body,
            fields: [
                {
                    name: 'Github',
                    value: `[\`↗\`](${cl.url})`,
                    inline: true
                },
                {
                    name: 'ID',
                    value: cl.id.toString(),
                    inline: true
                },
                {
                    name: 'Published',
                    value: `<t:${moment(cl.published_at).unix()}:F>`,
                    inline: true
                }
            ]
        });
        interaction.reply({ embeds: [embed] });
    }
};