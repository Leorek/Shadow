import { Logger } from "@services/logger.service";
import { ExtendedClient } from "@typings/startup";
import { Collection } from "discord.js";

export async function registerAutocompleteInteractions(
  logger: Logger,
  client: ExtendedClient
): Promise<void> {
  logger.debug("Registering client autocomplete interactions...");
  client.autocompleteInteractions = new Collection();

//   const baseFolderPath = "./dist/interactions/autocomplete";
//   const files: string[] = fs
//     .readdirSync(path.resolve(`${baseFolderPath}`))
//     .filter((file) => file.endsWith(".js"));

//   for (const file of files) {
//     try {
//       const filePath = path.resolve(`${baseFolderPath}/${file}`);

//       // delete require cache for file
//       delete require.cache[filePath];

//       // import and register to client collection
//       const { default: autocompleteInteraction } = await import(filePath);
//       client.autocompleteInteractions.delete(autocompleteInteraction.name);
//       client.autocompleteInteractions.set(
//         autocompleteInteraction.name,
//         autocompleteInteraction
//       );
//     } catch (error) {
//       if (error instanceof Error) {
//         logger.error(
//           `Error registering autocomplete interaction '${file}': ${error.message}`
//         );
//       } else {
//         throw error;
//       }
//     }
//   }

  logger.trace("Registering client autocomplete interactions complete.");
}