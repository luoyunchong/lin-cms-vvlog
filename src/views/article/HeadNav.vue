<template>
  <div>
    <el-row>
      <el-col>
        <div class="headerWrapper">
          <el-header style="padding:0;background:#fff;" class="main-header">
            <div class="header-container">
              <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <!-- text-color="#000"
                  background-color="#fff"
                active-text-color="#ffd04b"-->
                <el-menu-item index="/index" class="block">
                  <router-link :to="{path:'/index'}">
                    <i class="el-icon-help"></i>
                    首页
                  </router-link>
                </el-menu-item>
                <el-menu-item index="login" v-show="!logined" style="float:right;">
                  <el-link>登录</el-link>
                </el-menu-item>
                <el-menu-item index="register" v-show="!logined" style="float:right;">
                  <el-link>注册</el-link>
                </el-menu-item>
                <el-menu-item v-if="logined" style="float:right;">
                  <current-user class="current-user"></current-user>
                </el-menu-item>
                <el-menu-item v-if="logined" style="float:right;">
                  <div style="line-height:55px;height:55px;padding-top:12px;">
                    <el-button type="primary" @click="confirmEdit()" icon="el-icon-edit" plain>发布随笔</el-button>
                  </div>
                </el-menu-item>
              </el-menu>
            </div>
          </el-header>
        </div>
      </el-col>
    </el-row>
    <login-register-dialog ref="loginRegister"></login-register-dialog>
  </div>
</template>

<script>
import { User as CurrentUser } from "@/components/layout";
import { mixinDevice } from "@/lin/utils/mixin";
import LoginRegisterDialog from "@/views/account/LoginRegisterDialog";
export default {
  name: "Base",
  components: { CurrentUser, LoginRegisterDialog },
  mixins: [mixinDevice],
  data() {
    return { activeIndex: "" };
  },
  computed: {
    logined() {
      return this.$store.state.logined;
    }
  },
  watch: {
    $route() {
      this.activeIndex = this.$router.path;
    }
  },
  created() {
    this.activeIndex = this.$route.path;
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == "login" || key == "register") {
        this.activeIndex = key;
        this.$refs["loginRegister"].show(key);
        return;
      }
      switch (key) {
        case "/home/index":
          // this.flushCom();
          break;
      }
      // this.$router.push(key);
    },
    flushCom: function() {
      this.$router.go(0);
    },
    async confirmEdit() {
      this.$emit("confirmEdit");
    }
  }
};
</script>
<style lang="scss" scoped>
.headerWrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10;
}
.mainWrapper {
  height: calc(100% - 80px);
  margin-top: 80px;
  padding-left: 0px;
  width: 100%;
  padding-right: 0px;
}
.main-header {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
  height: 5rem;
}
.header-container {
  max-width: 1440px;
  margin: auto;
  height: 100%;
  /deep/ .block {
    padding: 0px;
    a {
      display: block;
      padding: 0 20px;
    }
  }
  .current-user {
    height: 60px;
    /deep/ .el-dropdown {
      top: 10px;
      left: 5px;
    }
  }
}
</style>