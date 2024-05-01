import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("yesno")
    .setDescription("Sends a random gif or picture with yes or no")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("The option to return")
        .addChoices(
					{ name: 'Yes', value: 'yes' },
					{ name: 'No', value: 'no' },
					{ name: 'Maybe', value: 'maybe' },
				)
    ),
  async execute(interaction) {
    console.log("YesNoCommand.execute");
    try {
      const option = interaction.options.getString("option");
      const res = await fetch(
        `https://yesno.wtf/api${option ? `?force=${option}` : ""}`
      );
      const answer = await res.json();

      if (interaction.isRepliable()) {
        if (answer) {
          await interaction.reply(answer.image);
        } else {
          await interaction.reply("No answer this time :(");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
