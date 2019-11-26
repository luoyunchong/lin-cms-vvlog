import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugins/axios'

class Base {


    async getItem(id) {
        const res = await get(`v1/item/${id}`)
        return res
    }


    async getItems(params) {
        const res = await get('v1/item', params)
        return res
    }

    async getType(id) {
        const res = await get(`v1/type/${id}`)
        return res
    }


    async getTypes(params) {
        const res = await get('v1/type', params)
        return res
    }
}

export default new Base()
