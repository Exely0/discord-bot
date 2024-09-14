import {
  CommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
  TextChannel,
} from "discord.js";
import { createCanvas } from "canvas";
import { client } from "..";
import { cagnotte } from "./setcagnotte";

export interface Goal {
  name: string;
  price: string;
  value: number;
}

export const goals: { [key: string]: Goal } = {
  cafe: {
    name: "Un café",
    price: "50c",
    value: 0.5,
  },
  biere: {
    name: "Une bière",
    price: "5€",
    value: 5,
  },
  chaise_longue: {
    name: "Une chaise longue pour la terrasse",
    price: "15€",
    value: 15,
  },
  tirelire: {
    name: "Une tirelire cochon",
    price: "20€",
    value: 20,
  },
  voyageBDE: {
    name: "Une place pour le voyage du BDE",
    price: "180€",
    value: 180,
  },
};

function generateGoal(current: number, goal: Goal) {
  const { name, price, value } = goal;
  const width = 300;
  const height = 30;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, width, height);

  const barWidth = ((current / value) % 100) * width;

  ctx.fillStyle = "#2E8B57";
  ctx.fillRect(0, 0, barWidth, height);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 20px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(`${current}€ / ${price}`, width / 2, height / 2);
  return canvas.toBuffer();
}

export const data = new SlashCommandBuilder()
  .setName("cagnotte")
  .setDescription("Montant de la cagnotte!");

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isCommand()) return;

  const channelId = interaction.channelId;

  await interaction.reply({
    content: `Il y a environ ${cagnotte}€ dans la cagnotte, incroyable !`,
    flags: [4096],
  });

  try {
    for (const value of Object.values(goals)) {
      const bufferImage = generateGoal(cagnotte, value);
      const attachment = new AttachmentBuilder(bufferImage, {
        name: "prog.png",
      });
      const channel = await client.channels.fetch(channelId);
      if (channel instanceof TextChannel) {
        channel.send({
          content: value.name,
          files: [attachment],
          flags: [4096],
        });
      }
    }
  } catch (error) {
    console.error("error: ", error);
  }
}
