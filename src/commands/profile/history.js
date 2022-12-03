const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'history',
    description: 'Receive someones previous usernames.',
    category: 'profile',
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        let embed = {
            title: `\`[REMOVED]\` History`,
            color: client.c.fail,
            thumbnail: {
                url: client.config.logo
            },
            footer: client.config.footer,
            timestamp: Date.now(),
            description: `Mojang removed the ability to receive the name history to "**improve player safety and data privacy**".\n\nThis means that this command is not available anymore and will get removed in the future.`,
            fields: [
                {
                    name: 'Official Announcement',
                    value: '[`minecraft.net ↗`](https://help.minecraft.net/hc/en-us/articles/8969841895693-Username-History-API-Removal-FAQ)',
                    inline: true
                },
                {
                    name: 'Microsoft Privacy Statement',
                    value: '[`microsoft.com ↗`](https://privacy.microsoft.com/en-GB/privacystatement)',
                    inline: true
                }
            ]
        };
        interaction.reply({ embeds: [embed] });
    }
};