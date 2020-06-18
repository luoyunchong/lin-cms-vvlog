import { post, get, put, _delete } from "@/lin/plugin/axios";

class Comment {
  // constructor() {}

  async addComment(info) {
    const res = await post("api/blog/comments/", info);
    return res;
  }

  async getComment(id) {
    const res = await get(`api/blog/comments/${id}`);
    return res;
  }

  async editComment(id, info) {
    const res = await put(`api/blog/comments/${id}`, info);
    return res;
  }

  async delectComment(id) {
    const res = await _delete(`api/blog/comments/${id}`);
    return res;
  }

  async getPublicComments(pagesParmas) {
    const res = await get("api/blog/comments/public", pagesParmas);
    return res;
  }
}

export default new Comment();
