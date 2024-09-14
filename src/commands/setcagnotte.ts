import {
  CommandInteraction,
  SlashCommandBuilder,
  CommandInteractionOptionResolver,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setcagnotte")
  .setDescription("Set new value")
  .addNumberOption((option) =>
    option.setName("number").setDescription("New amount").setMinValue(0)
  );

export let cagnotte = 4.5;

export async function execute(interaction: CommandInteraction) {
  try {
    console.log("Received interaction:", interaction);
    const amount = interaction.options as CommandInteractionOptionResolver;
    const aamount = amount.getNumber("number");
    console.log(aamount);
    cagnotte = aamount as number;
    await interaction.reply({
      content: `@silent Le nouveau montant de la cagnotte est ${cagnotte}`,
      flags: [4096],
    });
  } catch (error) {
    console.log(error);
  }
}
