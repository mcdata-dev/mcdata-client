import { REST, Routes } from 'discord.js';
import config from '../config/config';

class RestManager {
    DiscordRest = new REST({ version: config.restVersion });
    client: any;

    constructor(client: any) {
        this.client = client;
    }

    async registerCommands() {
        if (!process.env.CLIENT_TOKEN) throw new Error('Client token was not provided');
        
        this.DiscordRest.setToken(process.env.CLIENT_TOKEN!);
        try {
            if (!this.client.user?.id) throw new Error('Client user was not resolved while initializing application commands');
            if (!process.env.GUILD_ID) {
                await this.DiscordRest.put(Routes.applicationCommands(this.client.user.id), {
                    body: this.client.commands.all.map((cmd: any) => cmd.data.toJSON())
                });
            } else {
                await this.DiscordRest.put(Routes.applicationGuildCommands(this.client.user.id, process.env.GUILD_ID), {
                    body: this.client.commands.all.map((cmd: any) => cmd.data.toJSON())
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default RestManager;