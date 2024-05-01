import { REST, Routes } from "discord.js";
import path from "node:path";
import { getAllCommands } from "./utils/getAllCommands";

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
  try {
    const allCommands = await getAllCommands(path.join(__dirname, "interactions/slashCommands"));
    const commands = allCommands.reduce((acc, command) => {
      if ("data" in command && "execute" in command) {
        acc.push(command.data.toJSON());
      }
      return acc;
    }, []);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
