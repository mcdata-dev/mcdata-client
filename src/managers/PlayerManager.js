const Axios = require('axios');
const { UuidCache } = require('./CacheManager');
const { getCurrentUnix } = require('../util/functions');
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
        let cached = UuidCache.find(x => x.name === this.player || x.id === this.player);
        if (cached) {
            if ((cached.cachedAt + TimeToCache) < Date.now()) UuidCache.delete(cached.name);
            return { status: 200, name: cached.name, id: cached.id, cachedAt: cached.cachedAt };
        }

        try {
            const { status, data } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${this.player}`);
            if (status !== 200) {
                let err = errors[status];
                if (err) return err;
                return { status: status || '???', msg: 'An unknown error occured.' };
            }
            UuidCache.set(data.name, { cachedAt: getCurrentUnix(), ...data });
            return { cachedAt: getCurrentUnix(), status, ...data };
        } catch ({ response: { status } }) {
            let err = errors[status];
            if (err) return err;
            return { status: status || '???', msg: 'An unknown error occured.' };
        }
    }

    async UUIDToUsername() {
        let cached = UuidCache.find(x => x.name === this.player || x.id === this.player);
        if (cached) {
            if ((cached.cachedAt + TimeToCache) < Date.now()) UuidCache.delete(cached.name);
            return { status: 200, name: cached.name, id: cached.id, cachedAt: cached.cachedAt };
        }

        try {
            const { status, data } = await Axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${this.player}`);
            UuidCache.set(data.name, { cachedAt: getCurrentUnix(), ...data });
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