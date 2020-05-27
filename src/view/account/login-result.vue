<template>
  <div v-loading.fullscreen.lock="loading">
    <router-link :to="{path:'/index'}">
      <el-button type="primary">回到首页</el-button>
    </router-link>
  </div>
</template>

<script>
const axios = require("axios");
function parseUrlParams() {
  if (window.location.search.length <= 0) return false;
  var info = window.location.search.slice(1);
  var result = {};
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
export default {
  data() {
    return {
      loading: false
    };
  },
  created() {
    this.loading = true;
    var result = parseUrlParams();
    if (!(result && result.token)) {
      alert("无效的登录");
      this.loading = false;
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
        const user = await User.getAuths();
        this.setUserAndState(user);
        this.setUserAuths(user.permissions);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = true;
        location.href = "/";
      }
    }
  }
};
</script>

<style>
</style>