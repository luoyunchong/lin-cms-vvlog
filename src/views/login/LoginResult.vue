<template>
  <div>logining</div>
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
import User from "@/lin/models/user";
import { saveTokens } from "@/lin/utils/token";
export default {
  data() {
    return {};
  },
  created() {
    var result = parseUrlParams();
    if (!(result && result.token)) {
      alert("无效的登录");
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
        this.setUserAuths(user.auths);
      } catch (e) {
        console.log(e);
      } finally {
        location.href = "index";
      }
    }
  }
};
</script>

<style>
</style>