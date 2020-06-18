import { post, get, put, _delete } from "@/lin/plugin/axios";

class Subscribe {
    async addSubscribe(params) {
        const res = await post(`api/blog/subscribe/${params.subscribeUserId}`);
        return res;
    }

    async getSubscribe(params) {
        const res = await get(`api/blog/subscribe/${params.subscribeUserId}`);
        return res;
    }


    async deleteSubscribe(params) {
        const res = await _delete(`api/blog/subscribe/${params.subscribeUserId}`);
        return res;
    }

    async getSubscribes(params) {
        const res = await get("api/blog/subscribe", params);
        return res;
    }

    async getFans(params) {
        const res = await get("api/blog/subscribe/fans", params);
        return res;
    }
    async getUserSubscribe(params) {
        const res = await get(`api/blog/subscribe/user/${params.userId}`);
        return res;
    }
}

export default new Subscribe();
