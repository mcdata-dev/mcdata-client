import { Client } from 'discord.js';
import { join } from 'path';
import CommandManager from '../managers/CommandManager';
import EventManager from '../managers/EventManager';
import RestManager from '../managers/RestManager';
import config from '../config/config';

class McClient extends Client {
    commands = new CommandManager(this);
    events = new EventManager(this);
    restApi = new RestManager(this);
    config = config;
    colors = config.colors;
    emotes = config.emotes;

    constructor(options: any) {
        super(options);
        this.init();
    }

    async authenticate(token: string) {
        try {
            console.log(`Initializing client with token ${token.substring(0, 5)}************`);
            await this.login(token);
        } catch (e) {
            console.log(`Failed to authenticate client with token ${token.substring(0, 5)}************`);
        }
    }

    init() {
        this.commands.load(join(__dirname, '../commands/'));
        this.events.load(join(__dirname, './events/'));
    }
}

export default McClient;