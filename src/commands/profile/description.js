const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'description',
    description: 'Settings regarding your description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'set',
            description: 'Set a description for your profile.',
            type: ApplicationCommandOptionType.Subcommand,
            required: false,
            options: [
                {
                    name: 'desc',
                    description: 'The description you want.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: 'delete',
            description: 'Delete the description on your profile.',
            type: ApplicationCommandOptionType.Subcommand,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.data[0];
        let user = await client.prisma.profile.findUnique({
            where: { userId: interaction.user.id }
        });

        switch (query.name) {
            case 'set':
                try {
                    await client.prisma.profile.upsert({
                        where: { userId: interaction.user.id },
                        update: { desc: query.options[0].value },
                        create: { userId: interaction.user.id, desc: query.options[0].value }
                    });

                    if (!user) return interaction.reply(client.embeds.done('Your profile has been created & description has been set.'));
                    else return interaction.reply(client.embeds.done('Your description has been updated.'));
                } catch (e) {
                    return interaction.reply(client.embeds.error);
                }

            case 'delete':
                if (!user) return interaction.reply(client.embeds.fail('You don\'t have a profile.'));
                try {
                    await client.prisma.profile.update({
                        where: { userId: interaction.user.id },
                        data: { desc: null }
                    });

                    return interaction.reply(client.embeds.done('Your description has been reset.'));
                } catch (e) {
                    return interaction.reply(client.embeds.error);
                }
        };
    }
};