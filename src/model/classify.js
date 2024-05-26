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
  async updateClassify(id, data) {
    const res = await put(`api/blog/classifies/${id}`, data)
    return res
  }
  async createClassify(data) {
    const res = await post(`api/blog/classifies`, data)
    return res
  }
  async deleteClassify(id) {
    const res = await _delete(`api/blog/classifies/${id}`)
    return res
  }
}

export default new Classify();
