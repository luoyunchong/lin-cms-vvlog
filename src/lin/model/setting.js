import { post, get, put, _delete } from "@/lin/plugin/axios";

class Setting {
    async getSettingByKey(key) {
        const res = await get(`cms/settings/key/${key}`);
        return res;
    }
    async getSettingByKeys(params) {
        const res = await get(`cms/settings/keys`, params);
        return res;
    }
    async setSettingValues(params) {
        const res = await post(`cms/settings/set-values`, params);
        return res;
    }

}

export default new Setting();
