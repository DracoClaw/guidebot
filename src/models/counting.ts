export default class Counting {
    constructor(public channel: string,
        public currCount: number,
        public bestCount: number,
        public lastUserID: string,
        public lastMsgId: string,
        public textTimeout: number,
        public embedMsg: string,
		public limit: number,
		public currLimit: number) {}
}