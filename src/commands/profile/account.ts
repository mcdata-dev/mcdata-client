import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import CommandBase from '../../utils/CommandBase';
import McClient from '../../client/Client';
import PlayerManager from '../../managers/PlayerManager';
import { MojangAccount } from '../../types/global.interface';

export default class Account extends CommandBase {
    constructor() {
        super(new SlashCommandBuilder()
            .setName('account')
            .setDescription('Commands related to Minecraft accounts.')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('link')
                    .setDescription('Link a Minecraft account to your Discord account.')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('unlink')
                    .setDescription('Unlink a Minecraft account from your Discord account.')
                    .addStringOption(option =>
                        option
                            .setName('account')
                            .setDescription('The account you want to unlink.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('set_main')
                    .setDescription('Set a Minecraft account as your main account.')
                    .addStringOption(option =>
                        option
                            .setName('account')
                            .setDescription('The account you want to set as main.')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('list')
                    .setDescription('List all Minecraft accounts linked to your Discord account.')
            )
        );
    }

    async execute(client: McClient, interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'link':
                await this.notImplemented(client, interaction);
                break;
            case 'unlink':
                await this.notImplemented(client, interaction);
                break;
            case 'set_main':
                await this.notImplemented(client, interaction);
                break;
            case 'list':
                await this.notImplemented(client, interaction);
                break;
        }
    }

    async link(client: McClient, interaction: ChatInputCommandInteraction) {
        // Will be implemented in the future.
    };

    async unlink(client: McClient, interaction: ChatInputCommandInteraction) {
        const username = interaction.options.getString('account', true);
        const player = new PlayerManager(username);
        const account = await player.getAccount();

        if ('error' in account) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'This account does not exist.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        const accountList = await client.prisma.minecraftAccount.findMany({
            where: {
                user_id: interaction.user.id
            }
        });

        if (accountList.length === 0) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'You have no accounts linked.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        let targetAccount = accountList.find(x => x.uuid === account.id);
        if (!targetAccount) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'Account not found in your linked accounts.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        };

        await client.prisma.minecraftAccount.delete({
            where: {
                id: targetAccount.id
            }
        });

        let embed = new EmbedBuilder({
            description: client.emotes.done + `Account unlinked: \`${account.name}\``,
            color: client.colors.done
        });

        // If the targetAccount is the main account, set the oldest account as the main account.
        if (targetAccount.main) {
            const oldestAccount = accountList.filter(x => x.uuid !== targetAccount.uuid).sort((a, b) => a.created_at.getTime() - b.created_at.getTime())[0];
            if (oldestAccount && oldestAccount.id !== targetAccount.id) {

                await client.prisma.minecraftAccount.update({
                    where: {
                        id: oldestAccount.id
                    },
                    data: {
                        main: true
                    }
                });

                const newPlayer = new PlayerManager(oldestAccount.uuid);
                const newAccount = await newPlayer.getAccount();
                if ('error' in newAccount) {
                    embed.setDescription(client.emotes.done + `Account unlinked: \`${account.name}\`.\n${client.emotes.error} Main account set to \`Unknown\`.`);
                } else {
                    embed.setDescription(client.emotes.done + `Account unlinked: \`${account.name}\`.\n${client.emotes.error} Main account set to \`${newAccount.name}\`.`);
                }
            }

        }

        return interaction.reply({ embeds: [embed] });
    };

    async setMain(client: McClient, interaction: ChatInputCommandInteraction) {
        const username = interaction.options.getString('account', true);
        const player = new PlayerManager(username);
        const account = await player.getAccount();

        if ('error' in account) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'This account does not exist.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        const accountList = await client.prisma.minecraftAccount.findMany({
            where: {
                user_id: interaction.user.id
            }
        });

        if (accountList.length === 0) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'You have no accounts linked.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        let targetAccount = accountList.find(x => x.uuid === account.id);
        if (!targetAccount) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'Account not found in your linked accounts.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        };

        let mainAccount = accountList.find(account => account.main);
        if (mainAccount?.uuid === targetAccount.uuid) {
            let embed = new EmbedBuilder({
                description: client.emotes.fail + 'Account is already set as main.',
                color: client.colors.fail
            });

            return interaction.reply({ embeds: [embed] });
        }

        if (mainAccount) {
            await client.prisma.minecraftAccount.update({
                where: {
                    id: mainAccount.id
                },
                data: {
                    main: false
                }
            });
        }

        await client.prisma.minecraftAccount.update({
            where: {
                id: targetAccount.id
            },
            data: {
                main: true
            }
        });

        let embed = new EmbedBuilder({
            description: client.emotes.done + `Main account set to \`${account.name}\``,
            color: client.colors.done
        });

        return interaction.reply({ embeds: [embed] });
    };

    async list(client: McClient, interaction: ChatInputCommandInteraction) {
        const accountList = await client.prisma.minecraftAccount.findMany({
            where: {
                user_id: interaction.user.id
            }
        })

        let accountNames: MojangAccount[] = [];
        let mainAccount: MojangAccount | undefined;
        await Promise.all(accountList.map(async account => {
            const player = new PlayerManager(account.uuid);
            const mojangAccount = await player.getAccount();
            if ('error' in mojangAccount) {
                console.log(mojangAccount.error);
            } else {
                if (account.main) return mainAccount = mojangAccount;
                accountNames.push(mojangAccount);
            }
        }));

        let embed = new EmbedBuilder({
            title: `Account List | ${interaction.user.displayName}`,
            color: client.colors.main,
            fields: [
                {
                    name: 'Main',
                    value: mainAccount ? mainAccount.name : '`-`',
                    inline: true
                },
                {
                    name: 'Accounts',
                    value: accountNames.length > 0 ? accountNames.map(account => account.name).join('\n') : '`-`',
                    inline: true
                }
            ],
            footer: {
                text: 'McData',
                iconURL: client.config.icon
            },
            thumbnail: {
                url: client.config.icon
            },
            timestamp: new Date()
        });

        return interaction.reply({ embeds: [embed] });
    };

    notImplemented(client: McClient, interaction: ChatInputCommandInteraction) {
        let embed = new EmbedBuilder({
            title: 'Not Implemented',
            description: '> _Account linking has been disabled until account verification is implemented._',
            fields: [
                {
                    name: 'Reason',
                    value: 'Account verification prevents abuse and misuse of the system, ensuring that only the rightful owner can link their account.',
                    inline: true
                },
                {
                    name: 'ETA',
                    value: 'Unknown',
                    inline: true
                }
            ],
            color: client.colors.fail,
            timestamp: new Date(),
            footer: {
                text: 'McData',
                iconURL: client.config.icon
            },
            thumbnail: {
                url: client.config.icon
            }
        });

        return interaction.reply({ embeds: [embed] });
    }


}