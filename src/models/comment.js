import { post, get, put, _delete } from "@/lin/plugins/axios";

class Comment {
  // constructor() {}

  async addComment(info) {
    const res = await post("v1/comment/", info);
    return res;
  }

  async getComment(id) {
    const res = await get(`v1/comment/${id}`);
    return res;
  }

  async editComment(id, info) {
    const res = await put(`v1/comment/${id}`, info);
    return res;
  }

  async delectComment(id) {
    const res = await _delete(`v1/comment/${id}`);
    return res;
  }

  async getPublicComments(pagesParmas) {
    const res = await get("v1/comment/public", pagesParmas);
    return res;
  }
}

export default new Comment();
