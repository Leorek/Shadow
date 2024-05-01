import { Client, Collection } from "discord.js";

export type RegisterClientInteractionsParams = {
  client: ExtendedClient;
  executionId: string;
};

export type ExtendedClient = Client & {
  slashCommandInteractions: Collection<string, any>;
  autocompleteInteractions: Collection<string, any>;
  componentInteractions: Collection<string, any>;
};
