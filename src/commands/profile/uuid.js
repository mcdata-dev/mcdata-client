const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');

module.exports = {
    name: 'uuid',
    description: 'Get the UUID from a Minecraft user.',
    category: 'profile',
    type: ApplicationCommandType.ChatInput,
    cooldown: 5000,
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
        if (!query) {
            let profile = await client.prisma.profile.findUnique({
                where: { userId: interaction.user.id }
            });

            if (!profile.uuid) return interaction.reply(client.embeds.fail('You don\'t have a linked account. Link your account or provide a username.'));

            let player = new PlayerManager(profile.uuid);
            player.UUIDToUsername().then((data) => {
                let embed = new EmbedBuilder({
                    title: `Username >> UUID | ${data.name}`,
                    color: client.c.main,
                    thumbnail: {
                        url: `https://crafatar.com/avatars/${profile.uuid}`
                    },
                    footer: client.config.footer,
                    timestamp: Date.now(),
                    fields: [
                        {
                            name: 'UUID',
                            value: profile.uuid,
                            inline: true
                        },
                        {
                            name: 'Cached',
                            value: '`-`',
                            inline: true
                        }
                    ]
                });
                return interaction.reply({ embeds: [embed] });
            });
        } else {

            let player = new PlayerManager(query);
            player.usernameToUUID().then((data) => {
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));
                let embed = new EmbedBuilder({
                    title: `Username >> UUID | ${data.name}`,
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