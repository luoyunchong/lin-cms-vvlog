import { post, get, put, _delete } from "@/lin/plugin/axios";

class Classify {

  async getClassify(id) {
    const res = await get(`v1/classify/${id}`);
    return res;
  }

  async getClassifys(params) {
    const res = await get("v1/classify", params);
    return res;
  }
}

export default new Classify();
