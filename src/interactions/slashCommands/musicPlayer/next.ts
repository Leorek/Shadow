import {
  CacheType,
  GuildMember,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { GuildQueue, useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Plays next song in the queue"),
  async execute(interaction: Interaction<CacheType>) {
    try {
      const member = interaction.member as GuildMember;
      const memberVoiceChannel = member.voice.channel;
      const queue: GuildQueue = useQueue(member.guild.id)!;

      if (memberVoiceChannel) {
        if (interaction.isRepliable()) {
          queue.node.skip();
          await interaction.reply("Playing next song in the queue");
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
