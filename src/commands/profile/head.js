const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');

module.exports = {
    name: 'head',
    description: 'View the head (2D/3D) of a player.',
    category: 'profile',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'username',
            description: 'A minecraft username.',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'type',
            description: '2D or 3D',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: '2d',
                    value: '2d'
                },
                {
                    name: '3d',
                    value: '3d'
                }
            ]
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('username')?.value;
        let type = interaction.options.get('type')?.value;

        if (!query) {
            let profile = await client.prisma.profile.findUnique({
                where: { userId: interaction.user.id }
            });
            if (!profile.uuid) return interaction.reply(client.embeds.fail('You don\'t have a linked account. Link your account or provide a username.'));

            let player = new PlayerManager(profile.uuid);
            player.UUIDToUsername().then(async (data) => {
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));

                let embed = new EmbedBuilder({
                    title: `\`[${type ? type.toUpperCase() : '2D'}]\` Head | ${data.name}`,
                    color: client.c.main,
                    footer: client.config.footer,
                    timestamp: Date.now()
                });

                if (type === '3d') {
                    await player.giveHead({ type: '3d', id: data.id }).then((image) => {
                        embed.setImage(image);
                    });
                } else {
                    await player.giveHead({ id: data.id }).then((image) => {
                        embed.setImage(image);
                    });
                }

                return interaction.reply({ embeds: [embed] });

            });
        } else {

            let player = new PlayerManager(query);
            player.usernameToUUID().then(async (data) => {
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));

                let embed = new EmbedBuilder({
                    title: `\`[${type ? type.toUpperCase() : '2D'}]\` Head | ${data.name}`,
                    color: client.c.main,
                    footer: client.config.footer,
                    timestamp: Date.now()
                });

                if (type === '3d') {
                    await player.giveHead({ type: '3d', id: data.id }).then((image) => {
                        embed.setImage(image);
                    });
                } else {
                    await player.giveHead({ id: data.id }).then((image) => {
                        embed.setImage(image);
                    });
                }

                return interaction.reply({ embeds: [embed] });

            });
        }
    }
};