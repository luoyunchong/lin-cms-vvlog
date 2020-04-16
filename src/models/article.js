import { post, get, put, _delete } from "@/lin/plugins/axios";

class Article {
  // constructor() {}

  async addArticle(info) {
    const res = await post("v1/article/", info);
    return res;
  }

  async getArticle(id) {
    const res = await get(`v1/article/${id}`);
    return res;
  }

  async editArticle(id, info) {
    const res = await put(`v1/article/${id}`, info);
    return res;
  }

  async deleteArticle(id) {
    const res = await _delete(`v1/article/${id}`);
    return res;
  }

  async deleteCmsArticle(id) {
    const res = await _delete(`v1/article/cms/${id}`);
    return res;
  }

  async getArticles(pagesParmas) {
    const res = await get("v1/article/", pagesParmas);
    return res;
  }

  async getAllArticles(pagesParmas) {
    const res = await get("v1/article/all", pagesParmas);
    return res;
  }

  async getQueryArticles(pagesParmas) {
    const res = await get("v1/article/query", pagesParmas);
    return res;
  }

  async getSubscribeArticles(pagesParmas) {
    const res = await get("v1/article/subscribe", pagesParmas);
    return res;
  }


  async getArticleDraft(id) {
    const res = await get(`v1/article/draft/${id}`);
    return res;
  }
  async editArticleDraft(id, info) {
    const res = await put(`v1/article/draft/${id}`, info);
    return res;
  }
}

export default new Article();
