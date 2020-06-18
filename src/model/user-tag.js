import { post, get, put, _delete } from "@/lin/plugin/axios";

class UserTag {

    async addSubscribeTag(params) {
        const res = await post(`api/blog/user-tag/${params.tagId}`);
        return res;
    }
    async deleteSubscribeTag(params) {
        const res = await _delete(`api/blog/user-tag/${params.tagId}`);
        return res;
    }
    async getSubscribeTag(params) {
        const res = await get(`api/blog/user-tag/${params.tagId}`);
        return res;
    }

    async getSubscribeTags(params) {
        const res = await get(`api/blog/user-tag`, params);
        return res;
    }
}

export default new UserTag();
