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
          const currentTrack = queue.currentTrack!;

          const queueEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Music Queue")
            .addFields({ name: "Now Playing", value: currentTrack.title });

          // Split queue into parts if too long
          const maxLength = 1024;
          let description = "";

          const tracks = Array.isArray(queue.tracks) ? queue.tracks : queue.tracks.toArray();

          tracks.forEach((track, index) => {
            let trackInfo = `${index + 1}. ${track.title}\n`;
            if (description.length + trackInfo.length > maxLength) {
              queueEmbed.addFields({ name: "Up Next", value: description });
              description = "";
            }
            description += trackInfo;
          });
          if (description.length > 0) {
            queueEmbed.addFields({ name: "Remaining", value: description });
          }

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
