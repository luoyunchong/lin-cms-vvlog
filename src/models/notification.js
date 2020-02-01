import { post, get, put, _delete } from "@/lin/plugins/axios";

class Notification {
    // constructor() {}

    async addNotification(info) {
        const res = await post("v1/notification/", info);
        return res;
    }
    async getNotifications(params) {
        const res = await get(`v1/notification`, params);
        return res;
    }

}

export default new Notification();
