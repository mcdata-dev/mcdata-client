const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'All commands & more information.',
    category: 'general',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'command',
            description: 'A command you\'d like to see more information off.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('command')?.value?.toLowerCase();
        if (query) {

            let cmd = client.commands.get(query);
            if (!cmd) return interaction.reply(client.embeds.fail('This command does not exist.'));

            let embed = new EmbedBuilder({
                title: `Help | ${cmd.name}`,
                description: '> _* = required argument_',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now(),
                fields: [
                    {
                        name: 'Description',
                        value: cmd.description,
                        inline: true
                    },
                    {
                        name: 'Cooldown',
                        value: cmd.cooldown ? cmd.cooldown / 1000 + 's' : '`-`',
                        inline: true
                    }
                ]
            });

            if (cmd.options?.length > 0) {
                let arr = [];
                await cmd.options.forEach((val) => arr.push(`- **${val.name}${val.required ? '*' : ''}** >> ${val.description}`));
                embed.addFields({ name: 'Arguments', value: arr.join('\n') });
            }
            return interaction.reply({ embeds: [embed] });
        } else {
            let embed = new EmbedBuilder({
                title: 'Help',
                description: '> _Use `/help [command]` to get more information about a command._',
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
                footer: client.config.footer,
                timestamp: Date.now()
            });

            embed.addFields(
                { name: 'General', value: client.commands.filter(x => x.category === 'general').map(function (c) { return `\`${c.name}\``; }).join(', ') },
                { name: 'Info', value: client.commands.filter(x => x.category === 'info').map(function (c) { return `\`${c.name}\``; }).join(', ') },
                { name: 'Profile', value: client.commands.filter(x => x.category === 'profile').map(function (c) { return `\`${c.name}\``; }).join(', ') },
            );
            return interaction.reply({ embeds: [embed] });
        }
    }
};
