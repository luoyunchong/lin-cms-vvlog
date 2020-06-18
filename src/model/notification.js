import { post, get, put, _delete } from "@/lin/plugin/axios";

class Notification {
    // constructor() {}

    async addNotification(info) {
        const res = await post("api/blog/notifications/", info);
        return res;
    }
    async getNotifications(params) {
        const res = await get(`api/blog/notifications`, params);
        return res;
    }

}

export default new Notification();
