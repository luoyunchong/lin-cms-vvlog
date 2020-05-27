import { post, get, put, _delete } from "@/lin/plugin/axios";

class Setting {
    async editEditor(value) {
        const res = await post(`cms/setting/editor?value=${value}`);
        return res;
    }

    async getEditorSetting() {
        const res = await get(`cms/setting/editor`);
        return res;
    }

}

export default new Setting();
