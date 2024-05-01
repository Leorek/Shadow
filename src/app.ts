import { Events } from "discord.js";
import { randomUUID as uuidv4 } from "node:crypto";
import { createPlayer } from "./creators/createPlayer";
import { createClient } from "./creators/createClient";
import { loggerService, Logger } from "@services/logger.service";
import { Player } from "discord-player";
import { ExtendedClient } from "@typings/extendedClient";
import { registerClientInteractions } from "./startup/registerClientInteractions";
import { registerEventListeners } from "./startup/registerEventListeners";

const executionId: string = uuidv4();
const logger: Logger = loggerService.child({
  module: "shardingClient",
  name: "shardingClient",
  executionId: executionId,
  shardId: "client",
});

(async () => {
  try {
    const client: ExtendedClient = await createClient({ executionId });
    const player: Player = await createPlayer({ client, executionId });

    client.once(Events.ClientReady, async (readyClient) => {
      logger.debug(
        "Client Ready, registering client interactions and event listeners."
      );
      client.registerClientInteractions = registerClientInteractions;
      await registerEventListeners({ client, player, executionId });
      await registerClientInteractions({ client, executionId });
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = client.slashCommandInteractions.get(interaction.commandName);
  
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }
  
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });

    await client.login(process.env.BOT_TOKEN);
  } catch (err) {
    logger.error(err);
  }
})();
