import { sep, join } from 'path';
import { readdirSync } from 'node:fs';
import { Collection } from 'discord.js';

class CommandManager {
    public commands = new Collection();
    client: any;

    constructor(client: any) {
        this.client = client;
    }

    get(name: string) {
        return this.commands.get(name);
    }

    get all() {
        return this.commands;
    }

    load(dir: string) {
        readdirSync(dir).forEach((subDir) => {
            const commands = readdirSync(`${dir}${sep}${subDir}${sep}`);
            for (const cmd of commands) {
                const command = new (require(`${join(dir, subDir, cmd)}`).default)();
                if (command.data.name && typeof (command.data.name) === 'string' && command.data.description) {
                    if (this.commands.get(command.data.name)) return this.client.logger.error(`Two or more commands have the same name: ${command.data.name}`);
                    this.commands.set(command.data.name, command);
                }
            }
        })
    }
}

export default CommandManager;