import * as mongoDB from "mongodb";
import { GuideGuild, Counting, Spacer } from "../models";

export const collections: { guilds?: mongoDB.Collection } = {}

export async function connect() {
     const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI!);
    // const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb+srv://guideStaff:FWHMlUu0jZH0r4tP@guide0.dlcet.mongodb.net/GuideBot?retryWrites=true&w=majority");

    await client.connect();

     const db = client.db(process.env.LIVE_DB!);
    // const db = client.db("Guide1");

     const guildsCollection = db.collection(process.env.GUILD_COLLECTION!);
    // const guildsCollection = db.collection("guilds");

    collections.guilds = guildsCollection;
}

export async function getOrCreateGuildById(id: string): Promise<GuideGuild> {
    try {
        const query = { guildId: id };
        const guild = (await collections.guilds?.findOne(query)) as GuideGuild;

        if (guild) return Promise.resolve(guild);

        const newGuild = new GuideGuild(
            id,
            "",
            new Counting("", 0, 0, "", "", 10, "",3,1),
            new Spacer([], [], [])
        )

        const result = (await collections.guilds?.insertOne(newGuild))

        if (result) return Promise.resolve(newGuild);

        return Promise.reject("Failed to insert new guild!");
    } catch(error) {
        return Promise.reject(error);
    }
}

export async function updateGuild(guild: GuideGuild): Promise<GuideGuild> {
    try {
        const query = { _id: guild._id} 

        const result = await collections.guilds?.updateOne(query, { $set: guild } )

        if (result) return Promise.resolve(guild);

        return Promise.reject("Failed to update guild!");
    } catch(error) {
        return Promise.reject(error);
    }
}