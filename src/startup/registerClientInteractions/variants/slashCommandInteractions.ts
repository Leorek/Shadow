import path from "node:path";
import { Collection } from "discord.js";
import { Logger } from "@services/logger.service";
import { ExtendedClient } from "@typings/startup";
import { getAllCommands } from "@utils/getAllCommands";

export async function registerSlashCommandInteractions(
  logger: Logger,
  client: ExtendedClient
): Promise<void> {
  logger.debug("Registering client slash command interactions...");
  client.slashCommandInteractions = new Collection();

  logger.trace("Registering client commands...");

  const allCommands = await getAllCommands(
    path.join(__dirname, "../../../interactions/slashCommands")
  );

  allCommands.forEach((command) => {
    if ("data" in command && "execute" in command) {
      client.slashCommandInteractions.delete(command.name);
      client.slashCommandInteractions.set(command.data.name, command);
    }
  });

  logger.trace("Registering client slash command interactions complete.");
}
