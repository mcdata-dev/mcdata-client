import EventBase from "../../utils/EventBase";

class Ready extends EventBase {
    constructor(props: any) {
        super({ name: 'ready', once: true })
    }

    execute(client: any) {
        client.restApi.registerCommands();
        console.log(`Client - Logged in as ${client.user.tag}`)
    }
}

export default Ready;