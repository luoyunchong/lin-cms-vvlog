import { post, get, put, _delete } from "@/lin/plugins/axios";

class Classify {
  async addClassify(params) {
    const res = await post("v1/classify", params);
    return res;
  }

  async getClassify(id) {
    const res = await get(`v1/classify/${id}`);
    return res;
  }

  async editClassify(id, data) {
    const res = await put(`v1/classify/${id}`, data);
    return res;
  }

  async deleteClassify(id) {
    const res = await _delete(`v1/classify/${id}`);
    return res;
  }

  async getClassifys(params) {
    const res = await get("v1/classify", params);
    return res;
  }
}

export default new Classify();
