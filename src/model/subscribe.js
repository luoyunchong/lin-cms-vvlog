import { post, get, put, _delete } from "@/lin/plugin/axios";

class Subscribe {
    async addSubscribe(params) {
        const res = await post(`v1/subscribe/${params.subscribeUserId}`);
        return res;
    }

    async getSubscribe(params) {
        const res = await get(`v1/subscribe/${params.subscribeUserId}`);
        return res;
    }


    async deleteSubscribe(params) {
        const res = await _delete(`v1/subscribe/${params.subscribeUserId}`);
        return res;
    }

    async getSubscribes(params) {
        const res = await get("v1/subscribe", params);
        return res;
    }

    async getFans(params) {
        const res = await get("v1/subscribe/fans", params);
        return res;
    }
    async getUserSubscribe(params) {
        const res = await get(`v1/subscribe/user/${params.userId}`);
        return res;
    }
}

export default new Subscribe();
