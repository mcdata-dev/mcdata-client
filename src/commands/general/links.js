const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'links',
    description: 'Get related links.',
    category: 'general',
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        let embed = new EmbedBuilder({
            title: 'Links',
            color: client.c.main,
            thumbnail: {
                url: client.config.logo
            },
            fields: [
                {
                    name: 'Invite',
                    value: `[\`↗\`](${client.config.links.invite})`,
                    inline: true
                },
                {
                    name: 'Support',
                    value: `[\`↗\`](${client.config.links.support})`,
                    inline: true
                },
                {
                    name: 'Donate',
                    value: `[\`↗\`](${client.config.links.kofi})`,
                    inline: true
                },
                {
                    name: 'Documentation',
                    value: `[\`↗\`](${client.config.links.docs})`,
                    inline: true
                },
                {
                    name: 'ToS / Privacy Policy',
                    value: `[\`ToS ↗\`](${client.config.links.tos}) - [\`Privacy ↗\`](${client.config.links.privacy})`,
                    inline: true
                },
                {
                    name: 'Changelog',
                    value: `[\`↗\`](${client.config.links.changelog})`,
                    inline: true
                }
            ]
        });
        interaction.reply({ embeds: [embed] });
    }
};