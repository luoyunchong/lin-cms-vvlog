import { post, get, put, _delete } from "@/lin/plugin/axios";

class Classify {
  async addClassify(params) {
    const res = await post("api/blog/classifies", params);
    return res;
  }

  async getClassify(id) {
    const res = await get(`api/blog/classifies/${id}`);
    return res;
  }

  async editClassify(id, data) {
    const res = await put(`api/blog/classifies/${id}`, data);
    return res;
  }

  async deleteClassify(id) {
    const res = await _delete(`api/blog/classifies/${id}`);
    return res;
  }

  async getClassifys(params) {
    const res = await get("api/blog/classifies", params);
    return res;
  }
}

export default new Classify();
