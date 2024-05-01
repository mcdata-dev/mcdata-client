import { Client, Interaction } from "discord.js";
import EventBase from "../../utils/EventBase";

class InteractionCreate extends EventBase {
    constructor(props: any) {
        super({ name: 'interactionCreate' });
    }

    execute(client: any, interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const cmd = client.commands.get(interaction.commandName);
        if (cmd) cmd.execute(client, interaction);
    }
}

export default InteractionCreate;