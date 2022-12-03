const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');

module.exports = {
    name: 'uuid',
    description: 'Get the UUID from a Minecraft user.',
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
        if (!query) return interaction.reply(client.embeds.fail('You have to provide a username for now..'));

        if (query) {

            let player = new PlayerManager(query);
            player.usernameToUUID().then((data) => {
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.satus}]\` ${data.msg}`));
                let embed = new EmbedBuilder({
                    title: `Username >> UUID | Fyxren`,
                    color: client.c.main,
                    thumbnail: {
                        url: `https://crafatar.com/avatars/${data.id}`
                    },
                    footer: client.config.footer,
                    timestamp: Date.now(),
                    fields: [
                        {
                            name: 'UUID',
                            value: data.id,
                            inline: true
                        },
                        {
                            name: 'Cached',
                            value: `<t:${data.cachedAt}:R>`,
                            inline: true
                        }
                    ]
                });
                return interaction.reply({ embeds: [embed] });
            });

        }

    }
};