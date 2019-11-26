import { post, get, put, _delete } from "@/lin/plugins/axios";

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Article {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addArticle(info) {
    const res = await post("v1/article/", info);
    return res;
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
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
}

export default new Article();
