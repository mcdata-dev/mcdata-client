const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'ping',
    description: "Check the ping.",
    category: 'general',
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    run: async (client, interaction) => {
        let embed = {
            description: `🏓 Discord Websocket Latency: \`${Math.round(client.ws.ping)} ms\``,
            color: client.c.main
        }
        interaction.reply({ embeds: [embed] });
    }
};