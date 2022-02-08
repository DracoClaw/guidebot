import { ObjectId } from "mongodb";
import Counting from "./counting";
import Spacer from "./spacer"

export default class GuideGuild {
    constructor(public guildId: string,
        public staffRole: string,
        public counting: Counting,
		public spacer: Spacer,
        public _id?: ObjectId) {}
}