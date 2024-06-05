import { Message } from 'discord.js';

interface Reactions {
  [key: string]: string[];
}

const reactions: Reactions = {
  '21': ['9️⃣', '➕', '🔟'],
  '42': ['🐬'],
  '64': ['🍄'],
  '69': ['🇳', '🇮', '🇨', '🇪'],
  '96': ['🇪', '🇨', '🇮', '🇳'],
  '100': ['💯'],
  '101': ['🐕', '⚫', '⚪'],
  '123': ['4️⃣', '5️⃣', '6️⃣'],
  '314': ['🥧'],
  '360': ['⭕'],
  '365': ['📅'],
  '404': ['❗', '🇫', '🇴', '🇺', '🇳', '🇩'],
  '420': ['🔥'],
  '613': ['✡'],
  '616': ['🕷️', '👨🏻'],
  '626': ['🌺'],
  '666': ['😈'],
  '1234': ['🔢'],
  '4321': ['🚀'],
  '8008': ['🍈'],
};

export async function easterEgg(message: Message) {
  const messageReactions = reactions[message.content];
  if (messageReactions) {
    for (const reaction of messageReactions) {
      await message.react(reaction);
    }
  }
}
