import path from "node:path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { getAllCommands } from "./utils/getAllCommands";
import { randomUUID as uuidv4 } from "node:crypto";
import { createPlayer } from "./utils/player/createPlayer";

const executionId: string = uuidv4();

try {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });
  
  const player = await createPlayer({ client, executionId });

  client.commands = new Collection();

  const allCommands = await getAllCommands(path.join(__dirname, "commands"));

  allCommands.forEach((command) => {
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    }
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // generate dependencies report
    console.log(player.scanDeps());
    // ^------ This is similar to discord-voip's `generateDependenciesReport()` function, but with additional informations related to discord-player

    // log metadata query, search execution, etc.
    player.on('debug', console.log);
    // ^------ This shows how your search query is interpreted, if the query was cached, which extractor resolved the query or which extractor failed to resolve, etc.

    // log debug logs of the queue, such as voice connection logs, player execution, streaming process etc.
    player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
    // ^------ This shows how queue handles the track. It logs informations like the status of audio player, streaming process, configurations used, if streaming failed or not, etc.

  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

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

  client.login(process.env.BOT_TOKEN);
} catch (err) {
  console.log(err);
}
