import path from "path";
import { ICommand } from "../types/common";
import { glob } from "glob";

export async function getAllCommands(
  directory: string
): Promise<ICommand[]> {
  const commandFiles = await glob(`${directory}/**/*.ts`);
  const commands: ICommand[] = [];

  for (const file of commandFiles) {
    const command = (await import(path.resolve(file))).default;
    commands.push(command);
  }

  return commands;
}
