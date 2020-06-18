import {
    post,
    get,
    put,
    _delete,
} from '@/lin/plugin/axios'

class Monitor {

    async getServerInfo() {
        const res = await get(`v1/monitor/server-info/`)
        return res
    }

}

export default new Monitor()
