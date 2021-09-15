export default class Counting {
    constructor(public channel: string,
        public currCount: number,
        public bestCount: number,
        public lastUserTag: string,
        public lastMsgId: string,
        public textTimeout: number,
        public embedMsg: string) {}
}