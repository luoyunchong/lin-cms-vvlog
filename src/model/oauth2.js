import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugin/axios'

class OAuth2 {

    async getExternalProviders() {
        return await get(`cms/oauth2/external-providers`)
    }
    async signInBind(params) {
        return await get(`cms/oauth2/signin-bind`, params)
    }
    async bindlist() {
        return await get(`cms/oauth2/bindlist`)
    }
    async unbind(id) {
        return await _delete(`cms/oauth2/unbind/${id}`)
    }
}

export default new OAuth2()
