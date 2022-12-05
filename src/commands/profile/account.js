const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getCurrentUnix } = require('../../util/functions');
const PlayerManager = require('../../managers/PlayerManager');
module.exports = {
    name: 'account',
    description: '(Un)link your Minecraft username.',
    category: 'profile',
    cooldown: 3600000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'link',
            description: 'Link your Minecraft username.',
            type: ApplicationCommandOptionType.Subcommand,
            required: false,
            options: [
                {
                    name: 'username',
                    description: 'The Minecraft username you want to link. (TK: Verification will come in the future)',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'unlink',
            description: 'Unlink your Minecraft username.',
            type: ApplicationCommandOptionType.Subcommand,
            required: false,
            options: [
                {
                    name: 'uuid',
                    description: 'The UUID (to prevent accidents) of the account. - Use \'/uuid\' to get your UUID',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.data[0];
        switch (query.name) {
            case 'link':
                let player = new PlayerManager(query.options[0].value);
                player.usernameToUUID().then(async (data) => {
                    if (data.status !== 200) return interaction.reply(client.embeds.fail(`\`[${data.status}]\` ${data.msg}`));
                    try {
                        await client.prisma.profile.upsert({
                            where: { userId: interaction.user.id },
                            update: { uuid: data.id, linkedSince: getCurrentUnix() },
                            create: { userId: interaction.user.id, uuid: data.id, linkedSince: getCurrentUnix() },
                        });
                    } catch (e) {
                        client.logger.error(`account.js`, `Error while creating/updating a profile: ${e}`);
                        return interaction.reply(client.embeds.error);
                    }

                    let embed = new EmbedBuilder({
                        title: `${client.e.done}Username Linked | ${data.name}`,
                        description: `The username \`${data.name}\` has been linked.`,
                        fields: [
                            {
                                name: 'Note',
                                value: 'Yes, it\'s based on trust so there is no verifiaction.., _yet_.\n\nThere are plans to implement verification in the future to prevent trolls.',
                                inline: true
                            },
                            {
                                name: 'Cooldown',
                                value: '1 hour `(60 minutes)`',
                                inline: true
                            }
                        ],
                        color: client.c.done,
                        footer: client.config.footer,
                        timestamp: Date.now()
                    });
                    await player.giveHead({ id: data.id }).then((image) => embed.setThumbnail(image));
                    return interaction.reply({ embeds: [embed] });
                });
                break;
            case 'unlink':

                let user = await client.prisma.profile.findUnique({
                    where: { userId: interaction.user.id }
                });

                if (!user?.uuid) return interaction.reply(client.embeds.fail('You don\'t have a linked account.'));
                if (query.options[0].value.toLowerCase() !== user.uuid) return interaction.reply(client.embeds.fail('The linked Minecraft UUID doesn\'t match up with the given argument.'));

                try {
                    await client.prisma.profile.update({
                        where: {
                            userId: interaction.user.id
                        },
                        data: {
                            uuid: null,
                            linkedSince: null
                        }
                    });
                    return interaction.reply(client.embeds.done(`Your Minecraft account has been unlinked from your account.`));
                } catch (e) {
                    client.logger.error(`account.js`, `Error while trying to remove the uuid & linkedSince from profile: ${e}`);
                    return interaction.reply(client.embeds.error);
                }
        }
    }
};