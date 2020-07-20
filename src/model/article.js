import { post, get, put, _delete } from "@/lin/plugin/axios";

class Article {
  // constructor() {}

  async addArticle(info) {
    const res = await post("api/blog/articles/", info);
    return res;
  }

  async getArticle(id) {
    const res = await get(`api/blog/articles/${id}`);
    return res;
  }

  async editArticle(id, info) {
    const res = await put(`api/blog/articles/${id}`, info);
    return res;
  }

  async deleteArticle(id) {
    const res = await _delete(`api/blog/articles/${id}`);
    return res;
  }

  async deleteCmsArticle(id) {
    const res = await _delete(`api/blog/articles/cms/${id}`);
    return res;
  }

  async getArticles(pagesParmas) {
    const res = await get("api/blog/articles/", pagesParmas);
    return res;
  }

  async getAllArticles(pagesParmas) {
    const res = await get("api/blog/articles/all", pagesParmas);
    return res;
  }

  async getQueryArticles(pagesParmas) {
    const res = await get("api/blog/articles/query", pagesParmas);
    return res;
  }

  async getSubscribeArticles(pagesParmas) {
    const res = await get("api/blog/articles/subscribe", pagesParmas);
    return res;
  }


  async getArticleDraft(id) {
    const res = await get(`api/blog/articles/draft/${id}`);
    return res;
  }

  async editArticleDraft(id, info) {
    const res = await put(`api/blog/articles/draft/${id}`, info);
    return res;
  }
  async updateCommentable(id, commetable) {
    const res = await put(`api/blog/articles/${id}/comment-able/${commetable}`);
    return res;
  }
}

export default new Article();
