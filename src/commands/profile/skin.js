const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const PlayerManager = require('../../managers/PlayerManager');

module.exports = {
    name: 'skin',
    description: 'View the skin of a player.',
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
                if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));
                player.getBody(data.id).then((image) => {
                    let embed = new EmbedBuilder({
                        title: `Skin | ${data.name}`,
                        color: client.c.main,
                        image: {
                            url: image
                        },
                        footer: client.config.footer,
                        timestamp: Date.now()
                    });
                    return interaction.reply({ embeds: [embed] });
                });
            });
        } else {
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
                        footer: client.config.footer,
                        timestamp: Date.now()
                    });
                    return interaction.reply({ embeds: [embed] });
                });
            });
        }
    }
};