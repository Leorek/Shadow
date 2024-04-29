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
  
  await createPlayer({ client, executionId });

  client.commands = new Collection();

  const allCommands = await getAllCommands(path.join(__dirname, "commands"));

  allCommands.forEach((command) => {
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    }
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
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
