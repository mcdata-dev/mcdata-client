const Axios = require('axios');
const { UuidCache } = require('./CacheManager');
const TimeToCache = 8_640_000; //? 10m
const errors = {
    204: {
        status: 204,
        msg: 'This username does not exist.'
    },
    400: {
        status: 400,
        msg: 'The given username is invalid.'
    },
    404: {
        status: 404,
        msg: 'This username does not exist.'
    }
};

class PlayerManager {
    constructor(player) {
        this.player = player?.toLowerCase();
    }

    async usernameToUUID() {

        let cached = UuidCache.get(this.player);
        if (cached) {
            if ((cached.cachedAt + TimeToCache) < Date.now()) UuidCache.delete(this.player);
            return { status: 200, name: cached.name, id: cached.id, cachedAt: cached.cachedAt };
        }

        try {
            const { status, data } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${this.player}`);
            UuidCache.set(this.player, { cachedAt: getCurrentUnix(), ...data });
            return { cachedAt: getCurrentUnix(), status, ...data };
        } catch ({ response: { status } }) {
            return errors[status];
        }
    }

    //? Skins
    async giveHead(options) {
        return `https://crafatar.com/${options?.type?.toLowerCase() === '3d' ? 'renders/head' : 'avatars'}/${options.id}?overlay`;
    }

    async getBody(id) {
        return `https://crafatar.com/renders/body/${id}?overlay`;
    }

}

module.exports = PlayerManager;

function getCurrentUnix() {
    return Math.round((new Date()).getTime() / 1000);
}