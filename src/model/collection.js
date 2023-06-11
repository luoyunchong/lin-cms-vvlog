import { post, get, put, _delete } from '@/lin/plugin/axios'

class Collection {
  async createCollection(params) {
    const res = await post('api/blog/collection', params)
    return res
  }

  async getCollection(id) {
    const res = await get(`api/blog/collection/${id}`)
    return res
  }

  async getCollectionList(params) {
    const res = await get(`api/blog/collection`, params)
    return res
  }

  async updateCollection(id, data) {
    const res = await put(`api/blog/collection/${id}`, data)
    return res
  }

  async deleteCollection(id) {
    const res = await _delete(`api/blog/collection/${id}`)
    return res
  }

  async createOrCancelCollection(data) {
    const res = await post('api/blog/collection/article', data)
    return res
  }
}

export default new Collection()
