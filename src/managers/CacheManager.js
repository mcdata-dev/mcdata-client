const { Collection } = require("discord.js");
const ClearIntervals = {
    item: 8_640_000, //? 24h
    server: 600_000, //? 10m
    uuid: 8_640_000, //? 24h
};

// UUID
module.exports.UuidCache = new Collection();
module.exports.UuidCacheInterval = () => setInterval(() => {
    this.UuidCache.clear();
}, ClearIntervals.uuid);
