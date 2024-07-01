import { Collection } from "discord.js";
import { MojangAccount } from "../types/global.interface";

class PlayerManager {

    private player: string;
    private static usernameToUuidCache: Collection<string, MojangAccount> = new Collection();
    private static uuidToUsernameCache: Collection<string, MojangAccount> = new Collection();

    constructor(player: string) {
        this.player = player.toLowerCase();
    }

    get getHelm() {
        return `https://minotar.net/helm/${this.player}.png`
    }

    async getUsername(): Promise<string> {
        return (await this.uuidToUsername()).name;
    }

    async getUuid(): Promise<string> {
        return (await this.usernameToUuid()).id;
    }

    async usernameToUuid(): Promise<MojangAccount> {
        const cachedUuid = PlayerManager.usernameToUuidCache.get(this.player);
        if (cachedUuid) return cachedUuid;

        const data = await this.fetchUuidFromUsername();
        PlayerManager.usernameToUuidCache.set(this.player, data);
        PlayerManager.uuidToUsernameCache.set(data.id, data);

        return data;
    }

    async uuidToUsername(): Promise<MojangAccount> {
        const cachedUsername = PlayerManager.uuidToUsernameCache.get(this.player);
        if (cachedUsername) return cachedUsername;

        const data = await this.fetchUsernameFromUuid();
        PlayerManager.uuidToUsernameCache.set(this.player, data);
        PlayerManager.usernameToUuidCache.set(data.name, data);

        return data;
    }

    private async fetchUuidFromUsername(): Promise<MojangAccount> {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${this.player}`);
        if (!response.ok) throw new Error('Failed to fetch UUID from username.');
        return await response.json();
    }

    private async fetchUsernameFromUuid(): Promise<MojangAccount> {
        console.log('PLAYER: ', this.player)
        const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${this.player}`);
        if (!response.ok) throw new Error('Failed to fetch username from UUID.');
        return await response.json();
    }
}

export default PlayerManager;