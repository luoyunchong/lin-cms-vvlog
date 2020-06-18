import { post, get, put, _delete } from "@/lin/plugin/axios";

class Classify {

  async getClassify(id) {
    const res = await get(`api/blog/classifies/${id}`);
    return res;
  }

  async getClassifys(params) {
    const res = await get("api/blog/classifies", params);
    return res;
  }
}

export default new Classify();
