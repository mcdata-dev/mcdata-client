const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const badges = require('../../data/config/badges');

module.exports = {
    name: 'dev',
    description: 'Dev-only commands.',
    category: 'dev',
    devOnly: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'badge',
            description: 'Options regarding badges.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            required: false,
            options: [
                {
                    name: 'add',
                    description: 'Add a badge to a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to give a badge.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        },
                        {
                            name: 'badge',
                            description: 'The badge you want to give to the user.',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a badge from a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to remove the badge from.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        },
                        {
                            name: 'badge',
                            description: 'The badge you want to remove from the user.',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                }
            ],
        },
        {
            name: 'reload',
            description: 'Reload a command.',
            type: ApplicationCommandOptionType.Subcommand,
            required: false,
            options: [
                {
                    name: 'command',
                    description: 'The command you want to reload.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]

        }
        /*
        ! TK - Blacklist
        {
            name: 'blacklist',
            description: 'Options regarding the blacklist.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            required: false,
            options: [
                {
                    name: 'add',
                    description: 'Add someone to the blacklist.',
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to add to the blacklist.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove someone from the blacklist.',
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want remove from the blacklist.',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                }
            ],
        }
        */
    ],
    run: async (client, interaction) => {

        let query = interaction.options.data[0];

        switch (query.name) {
            case 'badge': {
                let data = query.options[0];
                switch (data.name) {
                    case 'add': {
                        if (!badges.list.includes(data.options[1].value.toLowerCase())) return interaction.reply(client.embeds.fail('This badge does not exist'));
                        let hasBadge = await client.prisma.badge.findFirst({ where: { userId: data.options[0].value, badge: data.options[1].value } });
                        if (hasBadge) return interaction.reply(client.embeds.fail(`<@${hasBadge.userId}> already has the \`${hasBadge.badge}\` badge.`));

                        let hasProfile = await client.prisma.profile.findUnique({ where: { userId: data.options[0].value } });

                        if (!hasProfile) {
                            try {
                                await client.prisma.profile.create({
                                    data: {
                                        userId: data.options[0].value
                                    }
                                });
                            } catch (e) {
                                client.logger.error('dev.js', `Error while trying to create a new profile: ${e}`);
                                return interaction.reply(client.embeds.error);
                            }
                        }

                        try {
                            await client.prisma.badge.create({
                                data: {
                                    userId: data.options[0].value, badge: data.options[1].value.toLowerCase()
                                }
                            });

                        } catch (e) {
                            client.logger.error('dev.js', `Error while trying to give a badge: ${e}`);
                            return interaction.reply(client.embeds.error);
                        }

                        if (!hasProfile) return interaction.reply(client.embeds.done(`Profile created for <@${data.options[0].value}> & the \`${data.options[1].value}\` badge has been given.`));
                        else return interaction.reply(client.embeds.done(`<@${data.options[0].value}> has been give the \`${data.options[1].value}\` badge.`));
                    }
                    case 'remove': {
                        if (!badges.list.includes(data.options[1].value.toLowerCase())) return interaction.reply(client.embeds.fail('This badge does not exist'));
                        let checkBadge = await client.prisma.badge.findFirst({ where: { userId: data.options[0].value, badge: data.options[1].value } });
                        if (!checkBadge) return interaction.reply(client.embeds.fail(`<@${data.options[0].value}> does not have the \`${data.options[1].value}\` badge.`));

                        try {
                            await client.prisma.badge.delete({
                                where: {
                                    id: checkBadge.id
                                }
                            });
                            return interaction.reply(client.embeds.done(`The \`${data.options[1].value}\` badge has been removed from <@${data.options[0].value}>.`));
                        } catch (e) {
                            client.logger.error('dev.js', `Error while trying to remove a badge: ${e}`);
                            return interaction.reply(client.embeds.error);
                        }
                    }
                }

                break;
            }
            case 'reload': {
                let givenCmd = query.options[0];
                let command = client.commands.get(givenCmd.value);
                if (!command) return interaction.reply(client.embeds.fail('This command does not exist.'));

                delete require.cache[
                    require.resolve(
                        `${process.cwd()}/src/commands/${command.category}/${command.name}.js`
                    )
                ];

                try {
                    const newCmd = require(`${process.cwd()}/src/commands/${command.category}/${command.name}.js`);
                    client.commands.set(newCmd.name, newCmd);
                    return interaction.reply(client.embeds.done(`Reloaded \`${givenCmd.value}\``));
                } catch (e) {
                    client.logger.error('dev.js', `Error while trying to reload the command ${command.name}: ${e}`);
                    return interaction.reply(client.embeds.fail(`Failed while trying to reload \`${givenCmd.value}\``));
                }
            }


            /*
            !TK - Blacklist
            case 'blacklist':
                return interaction.reply('TK');
            */

        }
    }
};
