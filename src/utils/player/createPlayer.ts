import { IPRotationConfig, Player } from "discord-player";

import { Client } from "discord.js";

export type CreatePlayerParams = {
  client: Client;
  executionId: string;
};

export const createPlayer = async ({
  client,
  executionId,
}: CreatePlayerParams): Promise<Player> => {
  //   const logger: Logger = loggerService.child({
  //     module: "utilFactory",
  //     name: "createPlayer",
  //     executionId: executionId,
  //     shardId: client.shard?.ids[0],
  //   });

  const ipRotationConfig = {
    blocks: [],
    exclude: [],
    maxRetries: 3,
  };

  try {
    // logger.debug("Creating discord-player player...");

    const player: Player = new Player(client, {
      useLegacyFFmpeg: false,
      skipFFmpeg: false,
      ipconfig: ipRotationConfig,
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            cookie: process.env.YT_COOKIE || "",
          },
        },
      },
    });

    // make player accessible from anywhere in the application
    // primarily to be able to use it in broadcastEval and other sharding methods
    // @ts-ignore
    global.player = player;

    await player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");
    // logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

    return player;
  } catch (error) {
    // logger.error(error, "Failed to create discord-player player");
    throw error;
  }
};
