import { loggerService, Logger } from "@services/logger.service";
import { RegisterClientInteractionsParams } from "@types/startup";
import { registerAutocompleteInteractions } from "./variants/autocompleteInteractions";
import { registerSlashCommandInteractions } from "./variants/slashCommandInteractions";

export const registerClientInteractions = async ({
  client,
  executionId,
}: RegisterClientInteractionsParams) => {
  const logger: Logger = loggerService.child({
    module: "register",
    name: "registerClientInteractions",
    executionId: executionId,
    shardId: client.shard?.ids[0],
  });

  await registerSlashCommandInteractions(logger, client);
  await registerAutocompleteInteractions(logger, client);
  await registerAutocompleteInteractions(logger, client);

  logger.debug("Registering all client interactions complete.");
};
