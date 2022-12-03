const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');

module.exports = {
    name: 'skin',
    description: 'View the skin of a player.',
    category: 'profile',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'username',
            description: 'A minecraft username.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('username')?.value;
        if (!query) return interaction.reply(client.embeds.fail('You have to provide a username for now.'));

        if (query) {

            let player = new PlayerManager(query);
            player.usernameToUUID().then((data) => {
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));
                player.getBody(data.id).then((image) => {
                    let embed = new EmbedBuilder({
                        title: `Skin | ${data.name}`,
                        color: client.c.main,
                        image: {
                            url: image
                        },
                        footer: {
                            icon_url: client.config.logo,
                            text: 'McData'
                        },
                        timestamp: Date.now()
                    });
                    return interaction.reply({ embeds: [embed] });
                });
            });
        }
    }
};