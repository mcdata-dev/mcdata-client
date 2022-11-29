const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'All commands & more information.',
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
                description: `> _* = required argument_`,
                color: client.c.main,
                thumbnail: {
                    url: client.config.logo
                },
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
                }
            });

            //? Oy mate, if it works it works 😎
            let cmds = [];
            ['general', 'info', 'profile'].forEach((cat) => {
                const cmdFiles = fs.readdirSync(`./src/commands/${cat}`).filter(file => file.endsWith('.js'));
                for (const file of cmdFiles) cmds.push({ category: cat, item: `\`${file.split('.')[0]}\`` });
            });

            embed.addFields(
                { name: 'General', value: cmds.filter(x => x.category === 'general').map(function (c) { return c.item; }).join(', ') },
                { name: 'Info', value: cmds.filter(x => x.category === 'info').map(function (c) { return c.item; }).join(', ') },
                { name: 'Profile', value: cmds.filter(x => x.category === 'profile').map(function (c) { return c.item; }).join(', ') }
            );
            return interaction.reply({ embeds: [embed] });
        }
    }
};