import { post, get, put, _delete } from "@/lin/plugins/axios";

class Setting {

    async getSettingEditor() {
        const res = await get(`cms/setting/editor`);
        return res;
    }


}

export default new Setting();
