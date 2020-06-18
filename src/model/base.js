import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugin/axios'

class Base {


    async getItem(id) {
        const res = await get(`api/base/item/${id}`)
        return res
    }


    async getItems(params) {
        const res = await get('api/base/item', params)
        return res
    }

    async getType(id) {
        const res = await get(`api/base/type/${id}`)
        return res
    }


    async getTypes(params) {
        const res = await get('api/base/type', params)
        return res
    }
}

export default new Base()
