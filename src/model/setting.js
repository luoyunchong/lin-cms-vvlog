import { post, get, put, _delete } from "@/lin/plugin/axios";

class Setting {

    async getSettingByKey(params) {
        const res = await get(`cms/settings/by-key`, params);
        return res;
    }

    async setSettingValues(params) {
        const res = await post(`cms/settings/set-values`, params);
        return res;
    }


}

export default new Setting();
