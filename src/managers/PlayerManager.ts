import { Collection } from "discord.js";
import { ApiError, MojangAccount, MojangErrorResponse } from "../types/global.interface";

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

    get getHead() {
        return `https://minotar.net/cube/${this.player}.png`
    }

    get getBody() {
        return `https://minotar.net/armor/body/${this.player}.png`
    }

    get getDownloadReady() {
        return `https://minotar.net/download/${this.player}.png`
    }

    async getAccount(): Promise<MojangAccount | ApiError> {
        if (this.player.length <= 16) return await this.usernameToUuid()
        else return await this.uuidToUsername()
    }

    async usernameToUuid(): Promise<MojangAccount | ApiError> {
        const cachedUuid = PlayerManager.usernameToUuidCache.get(this.player);
        if (cachedUuid) return cachedUuid;

        const data = await this.fetchUuidFromUsername();
        if ('error' in data) return data;

        const finalData = {
            id: data.id,
            name: data.name
        }

        PlayerManager.usernameToUuidCache.set(this.player, finalData);
        PlayerManager.uuidToUsernameCache.set(finalData.id, finalData);

        return finalData;
    }

    async uuidToUsername(): Promise<MojangAccount | ApiError> {
        const cachedUsername = PlayerManager.uuidToUsernameCache.get(this.player);
        if (cachedUsername) return cachedUsername;

        const data = await this.fetchUsernameFromUuid();
        if ('error' in data) return data;

        const finalData = {
            id: data.id,
            name: data.name
        }

        PlayerManager.uuidToUsernameCache.set(this.player, finalData);
        PlayerManager.usernameToUuidCache.set(finalData.name, finalData);

        return finalData;

    }

    private async fetchUuidFromUsername(): Promise<MojangAccount | ApiError> {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${this.player}`);

        // Mojang sometimes uses 204 status code to indicate that the player does not exist.
        if (response.status !== 200) {
            let err: MojangErrorResponse = await response.json();
            return { error: response.status, message: err.errorMessage };
        }

        return await response.json()
    }

    private async fetchUsernameFromUuid(): Promise<MojangAccount | ApiError> {
        const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${this.player}`);

        if (response.status !== 200) {
            let err: MojangErrorResponse = await response.json();
            return { error: response.status, message: err.errorMessage };
        }

        return await response.json();
    }
}

export default PlayerManager;