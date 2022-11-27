const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'View someones profile.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'A user.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('user')?.value;
        let user;

        if (query) {

            user = await client.prisma.profile.findFirst({
                where: { userId: query }
            });

            if (!user) return interaction.reply(client.embeds.fail('This user does not have a profile yet.'));

        } else {

            user = await client.prisma.profile.findFirst({
                where: {
                    userId: interaction.user.id
                }
            });

            if (!user) {
                try {
                    let newUser = await client.prisma.profile.create({
                        data: {
                            userId: interaction.user.id
                        }
                    });
                    user = newUser;
                    user.desc = '> _A profile has been created._';
                } catch (e) {
                    return interaction.reply(client.embeds.error);
                }
            }

        }

        let embed = new EmbedBuilder({
            title: `Profile | ${query ? interaction.guild.members.cache.get(user.userId).user.username : interaction.user.username}`,
            color: client.c.main,
            description: user.desc || null,
            thumbnail: {
                url: interaction.guild.members.cache.get(user.userId).user.displayAvatarURL({ dynamic: true, size: 2048 }) || client.user.displayAvatarURL({ size: 2048 })
            },
            fields: [
                {
                    name: 'UUID',
                    value: user?.uuid ? user.uuid : '`❌ - /link`',
                    inline: true
                },
                {
                    name: 'Linked Since',
                    value: user?.linkedSince ? user.linkedSince : '`-`',
                    inline: true
                },
                {
                    name: 'Badges',
                    value: user?.badges ? user.badges : '`-`',
                    inline: true
                }
            ]
        });

        return interaction.reply({ embeds: [embed] });

    }
};