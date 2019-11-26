import { post, get, put, _delete } from "@/lin/plugins/axios";

class Tag {
  async addTag(params) {
    const res = await post("v1/tag", params);
    return res;
  }

  async getTag(id) {
    const res = await get(`v1/tag/${id}`);
    return res;
  }

  async editTag(id, data) {
    const res = await put(`v1/tag/${id}`, data);
    return res;
  }

  async deleteTag(id) {
    const res = await _delete(`v1/tag/${id}`);
    return res;
  }

  async getTags(params) {
    const res = await get("v1/tag", params);
    return res;
  }
}

export default new Tag();
