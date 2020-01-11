import { post, get, put, _delete } from "@/lin/plugins/axios";

class Channel {
    async addChannel(params) {
        const res = await post("v1/channel", params);
        return res;
    }

    async getChannel(id) {
        const res = await get(`v1/channel/${id}`);
        return res;
    }

    async editChannel(id, data) {
        const res = await put(`v1/channel/${id}`, data);
        return res;
    }

    async deleteChannel(id) {
        const res = await _delete(`v1/channel/${id}`);
        return res;
    }

    async getChannels(params) {
        const res = await get("v1/channel", params);
        return res;
    }
}

export default new Channel();
