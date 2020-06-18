import { post, get, put, _delete } from "@/lin/plugin/axios";

class Channel {
    async getNavChannels(params) {
        const res = await get("api/blog/channels/nav", params);
        return res;
    }
}

export default new Channel();
