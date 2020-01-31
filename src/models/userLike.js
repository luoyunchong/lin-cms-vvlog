import { post, get, put, _delete } from "@/lin/plugins/axios";

class UserLike {
    // constructor() {}

    async likeOrCancel(info) {
        const res = await post("v1/user-like/", info);
        return res;
    }
}

export default new UserLike();
