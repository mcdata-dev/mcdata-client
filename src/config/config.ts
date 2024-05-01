import { GatewayIntentBits } from "discord.js";

export default {
    intents: [GatewayIntentBits.Guilds],
    restVersion: '10',
    ownerId: '462914535351779328',
    icon: 'https://i.imgur.com/yiwM0p9.jpg',
    colors: {
        main: 0xb7835a,
        done: 0x00ff00,
        fail: 0xff0000,
        error: 0xe5fa5a,
        pending: 0xf9f9f9
    },
    emotes: {
        done: '✅ | ',
        fail: '❌ | ',
        error: '⚠️ | ',
        pending: '⏱️ | '
    }
}