import 'dotenv/config';
import McClient from './client/Client';
import config from './config/config';

const client = new McClient({ intents: config.intents });
client.authenticate(process.env.CLIENT_TOKEN!);