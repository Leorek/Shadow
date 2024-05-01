import {
  CacheType,
  GuildMember,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { useMainPlayer } from "discord-player";

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
    const playerOptions = {
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 600_000,
      leaveOnEnd: false,
      leaveOnEndCooldown: 600_000,
      leaveOnStop: false,
      leaveOnStopCooldown: 600_000,
      defaultVolume: 50,
      maxQueueSize: 10_000,
      maxHistorySize: 1_000,
      bufferingTimeout: 3_000,
      connectionTimeout: 20_000,
      progressBar: {
          length: 14,
          timecodes: false,
          separator: '┃',
          indicator: '🔘',
          leftChar: '▬',
          rightChar: '▬'
      }
    };

    try {
      const member = interaction.member as GuildMember;
      const memberVoiceChannel = member.voice.channel;

      if (memberVoiceChannel) {
        const player = useMainPlayer();

        if (interaction.isRepliable()) {
          await interaction.deferReply();
        }

        if (interaction.isRepliable()) {
          const source = interaction.options.getString('source',true);

          const { track } = await player.play(memberVoiceChannel!, source, {
            requestedBy: interaction.user,
            nodeOptions: {
                ...playerOptions,
                maxSize: playerOptions.maxQueueSize,
                volume: playerOptions.defaultVolume,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.client,
                    requestedBy: interaction.user
                }
            }
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