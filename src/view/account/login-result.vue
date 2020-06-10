<template>
  <div>
    <router-link :to="{path:'/index'}">
      <el-button type="primary">回到首页</el-button>
    </router-link>
    <div class="margin-top-lg">
      <el-alert :title="errorMsg" type="error" v-if="error==true"></el-alert>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
function parseUrlParams() {
  if (window.location.search.length <= 0) return false;
  let info = window.location.search.slice(1);
  let result = {};
  info.split("&").forEach(item => {
    result[decodeURIComponent(item.split("=")[0])] = decodeURIComponent(
      item.split("=")[1]
    );
  });
  return result;
}

import { mapActions, mapMutations } from "vuex";
import User from "@/lin/model/user";
import { saveTokens } from "@/lin/util/token";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      error: false,
      errorMsg: ""
    };
  },
  created() {
    var loading = Loading.service({
      fullscreen: true,
      text: "登录中。。。",
      lock: true
      // spinner: "el-icon-loadings"
    });
    let result = parseUrlParams();
    if (!(result && result.token)) {
      this.errorMsg = "无效的登录";
      this.error = true;
      loading.close();
      return;
    }
    saveTokens(result.token);
    this.getInformation();
    // axios({
    //   methods: "get",
    //   url: "/cms/oauth2/GetOpenIdByToken",
    //   headers: {
    //     Authorization: "Bearer " + result.token
    //   }
    // })
    //   .then(function(response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .finally(function() {
    //     // always executed
    //   });
  },
  methods: {
    ...mapActions(["loginOut", "setUserAndState"]),
    ...mapMutations({
      setUserAuths: "SET_USER_AUTHS"
    }),
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
    }
  }
};
</script>

<style>
</style>