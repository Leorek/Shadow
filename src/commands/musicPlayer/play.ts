import {
  CacheType,
  GuildMember,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays the given source in voice channel")
    .addStringOption(option =>
			option
				.setName('source')
				.setDescription('The source to play')
				.setRequired(true)),
  async execute(interaction: Interaction<CacheType>) {
    try {
      const member = interaction.member as GuildMember;
      const memberVoiceChannel = member.voice.channel;

      if (memberVoiceChannel) {
        console.log("Joining voice channel");
        const player = useMainPlayer();

        if (interaction.isRepliable()) {
          await interaction.deferReply();
        }

        if (interaction.isRepliable()) {
          const source = interaction.options.getString('source',true);
          // const { track } = await player.play(memberVoiceChannel, source, {
          //   nodeOptions: {
          //     // nodeOptions are the options for guild node (aka your queue in simple word)
          //     metadata: interaction, // we can access this metadata object using queue.metadata later on
          //   },
          // });

          const { track } = await player.play(memberVoiceChannel, "./test.mp3", {
            searchEngine: QueryType.FILE, // QueryType.FILE tells discord-player to play from our file system,
            nodeOptions: {
              // nodeOptions are the options for guild node (aka your queue in simple word)
              metadata: interaction, // we can access this metadata object using queue.metadata later on
            },
          });

          return interaction.followUp(`**${track.title}** enqueued!`);
        }
      } else {
        if (interaction.isRepliable()) {
          interaction.reply(
            "You need to be in a voice channel to use this command"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
