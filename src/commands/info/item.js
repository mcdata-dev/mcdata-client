const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const Axios = require('axios');

module.exports = {
    name: 'item',
    description: "Get information about an item.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'item',
            description: 'Choose an item.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {

        let query = interaction.options.get('item').value;

        Axios.get('https://minecraft-ids.grahamedgecombe.com/items.json').then((res) => {

            let data = res.data.find(x => query === x.name || query === x.text_type || query === `${x.type}:${x.meta}` || query === x.type);
            if (data) {
                let embed = {
                    title: `Item | ${data.name}`,
                    description: `\`${data.text_type}\``,
                    color: client.c.main,
                    fields: [
                        {
                            name: 'ID',
                            value: `${data.type}:${data.meta}`,
                            inline: true
                        },
                        {
                            name: 'Type',
                            value: data.type,
                            inline: true
                        },
                        {
                            name: 'Meta',
                            value: data.meta,
                            inline: true
                        }
                    ]
                };
                return interaction.reply({ embeds: [embed] });
            }


        }).catch(e => {
            return interaction.reply(client.embeds.error());
        });
    }
};