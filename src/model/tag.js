import { post, get, put, _delete } from "@/lin/plugin/axios";

class Tag {
  async addTag(params) {
    const res = await post("api/blog/tags", params);
    return res;
  }

  async getTag(id) {
    const res = await get(`api/blog/tags/${id}`);
    return res;
  }

  async editTag(id, data) {
    const res = await put(`api/blog/tags/${id}`, data);
    return res;
  }

  async deleteTag(id) {
    const res = await _delete(`api/blog/tags/${id}`);
    return res;
  }

  async getTags(params) {
    const res = await get("api/blog/tags/public", params);
    return res;
  }
}

export default new Tag();
