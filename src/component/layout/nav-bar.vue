
<template>
  <div class="app-nav-bar">
    <div class="nav-content">
      <breadcrumb />
      <!-- 暂时放这里 -->
      <div class="right-info">
        <notify v-permission="'消息推送'" v-show="false" />
        <clear-tab></clear-tab>
        <screenfull />
        <user></user>
      </div>
    </div>
  </div>
</template>

<script>
import Notify from "@/component/notify/notify";
import Breadcrumb from "./breadcrumb";
import Screenfull from "./screen-full";
import User from "./user";
import ClearTab from "./clear-tab";

export default {
  name: "NavBar",
  created() {},
  components: {
    Breadcrumb,
    User,
    Notify,
    Screenfull,
    ClearTab
  }
};
</script>

<style lang="scss" scoped>
.app-nav-bar {
  width: 100%;
  height: $navbar-height;
  display: flex;
  align-items: center;
  .logo.js-min-logo {
    width: 64px;
    font-size: 16px;
    color: #fff;
  }
  .nav-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: $navbar-padding;
    .right-info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
