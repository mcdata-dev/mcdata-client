const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const badges = require('../../data/config/badges');

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

        if (query && query !== interaction.user.id) {
            user = await client.prisma.profile.findUnique({
                where: { userId: query },
                include: { badges: true }
            });
            if (!user) return interaction.reply(client.embeds.fail('This user does not have a profile yet.'));
        } else {
            user = await client.prisma.profile.findUnique({
                where: { userId: interaction.user.id },
                include: { badges: true }
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
                    name: 'Mc Account',
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
                    value: user.badges[0] ? getBadges(user.badges) : '`-`',
                    inline: true
                }
            ]
        });
        return interaction.reply({ embeds: [embed] });
    }
};

function getBadges(list) {
    let arr = [];
    list.forEach((val) => {
        arr.push(badges.data.find(x => x.id === val.badge).badge);
    });
    return arr.join(' ');
}