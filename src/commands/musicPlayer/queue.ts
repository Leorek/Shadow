import {
  CacheType,
  EmbedBuilder,
  GuildMember,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { GuildQueue, useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the queue of the current guild"),
  async execute(interaction: Interaction<CacheType>) {
    try {
      const member = interaction.member as GuildMember;
      const memberVoiceChannel = member.voice.channel;
      const queue: GuildQueue = useQueue(member.guild.id)!;

      if (memberVoiceChannel) {
        if (interaction.isRepliable()) {
          const tracks = queue.tracks
            .map((track, index) => `${index + 1}. ${track.title}`)
            .join("\n");
          const currentTrack = queue.currentTrack!;

          const queueEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Music Queue")
            .addFields(
              { name: "Now Playing", value: currentTrack.title },
              {
                name: "Up Next",
                value: tracks.length > 0 ? tracks : "No more songs in queue.",
              }
            );

          await interaction.reply({ embeds: [queueEmbed] });
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
