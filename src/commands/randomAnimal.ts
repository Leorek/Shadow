import { SlashCommandBuilder } from "discord.js";

// https://api.sefinek.net/docs/v2
// {animal} = cat; dog; fox; fish; alpaca; bird;

export default {
  data: new SlashCommandBuilder()
    .setName("randomanimal")
    .setDescription("Sends a random picture or gif of animals")
    .addStringOption((option) =>
      option
        .setName("animal")
        .setDescription("The type of animal you want to see")
        .addChoices(
					{ name: 'Cat', value: 'cat' },
					{ name: 'Dog', value: 'dog' },
					{ name: 'Fox', value: 'fox' },
          { name: 'Fish', value: 'fish' },
          { name: 'Alpaca', value: 'alpaca' },
          { name: 'Bird', value: 'bird' },
				)
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log("RandomAnimalCommand.execute");
    try {
      const animal = interaction.options.getString("animal");
      const res = await fetch(
        `https://api.sefinek.net/api/v2/random/animal/${animal}`
      );
      const catData = await res.json();
      const cat = catData?.message;

      if (interaction.isRepliable()) {
        if (cat) {
          await interaction.reply(cat);
        } else {
          await interaction.reply("No cat this time :(");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
