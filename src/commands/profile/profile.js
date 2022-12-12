const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');
const badges = require('../../data/config/badges');
const { compareBadges } = require('../../util/functions');

module.exports = {
    name: 'profile',
    description: 'View someones profile.',
    category: 'profile',
    type: ApplicationCommandType.ChatInput,
    cooldown: 5000,
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
                include: { badge: true }
            });
            if (!user) return interaction.reply(client.embeds.fail('This user does not have a profile yet.'));
        } else {
            user = await client.prisma.profile.findUnique({
                where: { userId: interaction.user.id },
                include: { badge: true }
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

        let imageURL;
        let mcName;
        if (user.uuid) {
            let player = new PlayerManager(user.uuid);
            await player.giveHead({ id: user.uuid }).then((image) => imageURL = image);
            await player.UUIDToUsername().then((data) => mcName = data.name);
        } else {
            imageURL = interaction.guild.members.cache.get(user.userId).user.displayAvatarURL({ dynamic: true, size: 2048 });
        }
        let embed = new EmbedBuilder({
            title: `Profile | ${query ? interaction.guild.members.cache.get(user.userId).user.username : interaction.user.username}`,
            color: client.c.main,
            description: user.desc || null,
            thumbnail: {
                url: imageURL
            },
            footer: client.config.footer,
            timestamp: Date.now(),
            fields: [
                {
                    name: 'Mc Account',
                    value: user?.uuid ? mcName : '`❌ - /link`',
                    inline: true
                },
                {
                    name: 'Linked Since',
                    value: user?.linkedSince ? `<t:${user.linkedSince}:D>` : '`-`',
                    inline: true
                },
                {
                    name: 'Badges',
                    value: user.badge.length > 0 ? await getBadges(user.badge) : '`-`',
                    inline: true
                }
            ]
        });
        return interaction.reply({ embeds: [embed] });
    }
};

function getBadges(list) {
    const arr = list.map(val => badges.data.find(x => x.id === val.badge));
    return arr
        .sort((a, b) => a.level < b.level ? -1 : 1)
        .map(x => x.badge)
        .join(' ');
}