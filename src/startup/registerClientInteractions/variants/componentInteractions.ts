import {  Logger } from "@services/logger.service";
import { ExtendedClient } from "@typings/startup";
import { Collection } from "discord.js";

export async function registerComponentInteractions(
  logger: Logger,
  client: ExtendedClient
): Promise<void> {
  logger.debug("Registering client component interactions...");
  client.componentInteractions = new Collection();

//   const baseFolderPath = "./dist/interactions/components";
//   const files: string[] = fs
//     .readdirSync(path.resolve(`${baseFolderPath}`))
//     .filter((file) => file.endsWith(".js"));

//   for (const file of files) {
//     try {
//       const filePath = path.resolve(`${baseFolderPath}/${file}`);

//       // delete require cache for file
//       delete require.cache[filePath];

//       // import and register to client collection
//       const { default: componentInteraction } = await import(filePath);
//       client.componentInteractions.delete(componentInteraction.name);
//       client.componentInteractions.set(
//         componentInteraction.name,
//         componentInteraction
//       );
//     } catch (error) {
//       if (error instanceof Error) {
//         logger.error(
//           `Error registering component interaction '${file}': ${error.message}`
//         );
//       } else {
//         throw error;
//       }
//     }
//   }

  logger.trace("Registering client component interactions complete.");
}