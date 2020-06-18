import { post, get, put, _delete } from "@/lin/plugin/axios";

class UserLike {
    // constructor() {}

    async likeOrCancel(info) {
        const res = await post("api/blog/user-like/", info);
        return res;
    }
}

export default new UserLike();
