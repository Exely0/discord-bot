import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

const updateCommands = async () => {
  console.log("Deploying commands...");
  try {
    await client.login(config.DISCORD_TOKEN);
    const guilds = await client.guilds.fetch();
    console.log("Fetching guilds...");
    for (const guild of guilds.values()) {
      await deployCommands({ guildId: guild.id });
      console.log(`Commands deployed to server: ${guild.name}`);
    }
    console.log("Commands deployed successfully.");
  } catch (error) {
    console.error("Error deploying commands:", error);
  } finally {
    await client.destroy();
    process.exit(0);
  }
};

const initializeBot = () => {
  client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
  });

  client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  });

  client.login(config.DISCORD_TOKEN);
};

const args = process.argv.slice(2);

if (args.includes("update")) {
  updateCommands();
} else {
  initializeBot();
}
