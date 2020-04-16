import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import mutations from './mutations'
import state from './state'
import * as getters from './getters'
import actions from './actions'


const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    logined: state.logined,
    user: state.user,
    permissions: state.permissions,
  }),
})


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production',
})
