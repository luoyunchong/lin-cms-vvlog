<template>
  <div>
    <router-link :to="{ path: '/index' }">
      <el-button type="primary">回到首页</el-button>
    </router-link>
    <div class="margin-top-lg">
      <el-alert :title="errorMsg" type="error" v-if="error == true"></el-alert>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
import { mapActions, mapMutations } from 'vuex'
import User from '@/lin/model/user'
import { saveTokens } from '@/lin/util/token'
import { ElLoading } from 'element-plus'
export default {
  data() {
    return {
      error: false,
      errorMsg: '',
    }
  },
  created() {
    var loading = ElLoading.service({
      fullscreen: true,
      text: '登录中。。。',
      lock: true,
      // spinner: "el-icon-loadings"
    })
    var result = this.$route.query
    if (!(result && result.token)) {
      this.errorMsg = '无效的登录'
      this.error = true
      loading.close()
      return
    }
    saveTokens(result.token)
    loading.close()
    this.getInformation()
  },
  methods: {
    ...mapActions(['loginOut', 'setUserAndState']),
    async getInformation() {
      try {
        const user = await User.getPermissions()
        this.setUserAndState(user)
      } catch (e) {
        console.log(e)
      } finally {
        var url = window.localStorage.getItem('OAUTH_LOGIN_URL')
        location.href = url
      }
    },
  },
}
</script>

<style></style>
