import * as mongoDB from 'mongodb';
import { Counting, GuideGuild } from '../models';

export const collections: { guilds?: mongoDB.Collection } = {};

export async function connect() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGODB_URI!
  );

  await client.connect();

  const db = client.db(process.env.DATABASE!);

  const guildsCollection = db.collection(process.env.GUILD_COLLECTION!);

  collections.guilds = guildsCollection;
}

export async function getOrCreateGuildById(id: string): Promise<GuideGuild> {
  try {
    const query = { guildId: id };
    const guild = (await collections.guilds?.findOne(query)) as GuideGuild;

    if (guild) return Promise.resolve(guild);

    const newGuild = new GuideGuild(
      id,
      new Counting('', 0, 0, '', '', 10, '', 3, 1),
    );

    const result = await collections.guilds?.insertOne(newGuild);

    if (result) return Promise.resolve(newGuild);

    return Promise.reject('Failed to insert new guild!');
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateGuild(guild: GuideGuild): Promise<GuideGuild> {
  try {
    const query = { _id: guild._id };

    const result = await collections.guilds?.updateOne(query, { $set: guild });

    if (result) return Promise.resolve(guild);

    return Promise.reject('Failed to update guild!');
  } catch (error) {
    return Promise.reject(error);
  }
}
