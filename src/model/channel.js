import { post, get, put, _delete } from "@/lin/plugin/axios";

class Channel {
    async getNavChannels(params) {
        const res = await get("v1/channel/nav", params);
        return res;
    }
}

export default new Channel();
