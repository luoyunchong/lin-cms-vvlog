import { post, get, put, _delete } from "@/lin/plugins/axios";

class Channel {
    async getChannels(params) {
        const res = await get("v1/channel", params);
        return res;
    }
}

export default new Channel();
