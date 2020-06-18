import { post, get, put, _delete } from "@/lin/plugin/axios";

class Setting {

    async GetSettingByKey(params) {
        const res = await get(`cms/settings/editor`, params);
        return res;
    }

    async setSettingValues(params) {
        const res = await post(`cms/settings/set-setting-values`, params);
        return res;
    }


}

export default new Setting();
