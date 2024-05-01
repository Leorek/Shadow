import { AutocompleteInteraction, Client, Collection, CommandInteraction } from "discord.js";

type RegisterClientInteractionsFunction = (params: { client: Client; executionId: string }) => void;

export type ExtendedClient = {
    registerClientInteractions?: RegisterClientInteractionsFunction;
    slashCommandInteractions?: Collection<string, CommandInteraction>;
    autocompleteInteractions?: Collection<string, AutocompleteInteraction>;
    componentInteractions?: Collection<string, CommandInteraction>;
} & Client;