import { readdirSync } from 'fs';
import { join } from 'path';

class EventManager {
    client: any;
    constructor(client: any) {
        this.client = client;
    }

    load(dir: string) {
        readdirSync(dir).forEach((subDir) => {
            const event = new (require(join(dir, subDir)).default)();

            if (event.props.once) return this.client.once(event.props.name, (...args: any) => event.execute(this.client, ...args));
            this.client.on(event.props.name, (...args: any) => event.execute(this.client, ...args));
        });
    }
}

export default EventManager;