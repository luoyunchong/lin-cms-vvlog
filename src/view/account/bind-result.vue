<template>
  <div>
    <router-link :to="{ path: '/index' }">
      <el-button type="primary">回到首页</el-button>
    </router-link>
    <div class="margin-top-lg">
      <el-alert :title="errorMsg" type="error" v-if="error == true"></el-alert>
      <el-alert :title="errorMsg" type="success" v-else></el-alert>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

import User from "@/lin/model/user";
import { saveTokens } from "@/lin/util/token";
import { ElLoading } from "element-plus";
export default {
  data() {
    return {
      error: false,
      errorMsg: "",
    };
  },
  created() {
    var loading = ElLoading.service({
      fullscreen: true,
      text: "绑定中。。。",
      lock: true,
      //  spinner: 'el-icon-loadings'
    });

    var query = this.$route.query;
    if (query.code == "Success") {
      this.errorMsg = query.message;
      this.error = false;
    } else {
      this.errorMsg = query.message;
      this.error = true;
    }
    loading.close();
  },
  methods: {
    async getInformation() {
      try {
        const user = await User.getPermissions();
        this.setUserAndState(user);
        this.setUserAuths(user.permissions);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = true;
        var url = window.localStorage.getItem("OAUTH_LOGIN_URL");

        location.href = url;
      }
    },
  },
};
</script>

<style></style>
