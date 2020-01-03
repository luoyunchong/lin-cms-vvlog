import { post, get, put, _delete } from "@/lin/plugins/axios";

class UserTag {

    async addSubscribeTag(params) {
        const res = await post(`v1/user-tag/${params.tagId}`);
        return res;
    }
    async deleteSubscribeTag(params) {
        const res = await _delete(`v1/user-tag/${params.tagId}`);
        return res;
    }
    async getSubscribeTag(params) {
        const res = await get(`v1/user-tag/${params.tagId}`);
        return res;
    }

    async getSubscribeTags(params) {
        const res = await get(`v1/user-tag`, params);
        return res;
    }
}

export default new UserTag();
