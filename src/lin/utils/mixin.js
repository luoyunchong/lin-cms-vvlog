// import Vue from 'vue'
import { deviceEnquire, DEVICE_TYPE } from '@/lin/utils/device'
import { mapState } from 'vuex'


const mixinDevice = {
    computed: {
        ...mapState({
            device: state => state.device
        })
    },
    methods: {
        isMobile() {
            return this.device === DEVICE_TYPE.MOBILE
        },
        isDesktop() {
            return this.device === DEVICE_TYPE.DESKTOP
        },
        isTablet() {
            return this.device === DEVICE_TYPE.TABLET
        }
    }
}

const AppDeviceEnquire = {
    mounted() {
        const { $store } = this
        deviceEnquire(deviceType => {
            switch (deviceType) {
                case DEVICE_TYPE.DESKTOP:
                    $store.commit('TOGGLE_DEVICE', 'desktop')
                    $store.dispatch('setSidebar', true)
                    break
                case DEVICE_TYPE.TABLET:
                    $store.commit('TOGGLE_DEVICE', 'tablet')
                    $store.dispatch('setSidebar', false)
                    break
                case DEVICE_TYPE.MOBILE:
                default:
                    $store.commit('TOGGLE_DEVICE', 'mobile')
                    $store.dispatch('setSidebar', true)
                    break
            }
        })
    }
}

export { AppDeviceEnquire, mixinDevice }
