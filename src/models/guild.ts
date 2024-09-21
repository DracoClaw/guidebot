import { ObjectId } from "mongodb";
import Counting from "./counting";

export default class GuideGuild {
  constructor(
    public guildId: string,
    public counting: Counting,
    public _id?: ObjectId
  ) {}
}
