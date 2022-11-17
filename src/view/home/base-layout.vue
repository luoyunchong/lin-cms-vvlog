<template>
  <div>
    <el-row>
      <el-col>
        <div class="headerWrapper">
          <el-header class="main-header">
            <div class="header-container">
              <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <!-- text-color="#000"
                  background-color="#fff"
                active-text-color="#ffd04b"-->
                <el-menu-item index="/index" class="block">
                  <router-link :to="{ path: '/index' }">
                    <i class="el-icon-help"></i>
                    首页
                  </router-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn" index="/subscribe" class="block">
                  <router-link :to="{ path: '/subscribe' }">
                    <i class="el-icon-c-scale-to-original"></i>关注
                  </router-link>
                </el-menu-item>
                <!-- <el-menu-item index="/tag" class="block">
                  <router-link :to="{path:'/tag'}">标签</router-link>
                </el-menu-item>-->
                <el-menu-item v-if="loggedIn" index="/notification/userComment" class="block">
                  <router-link :to="{ path: '/notification/userComment' }">
                    <i class="el-icon-bell"></i>消息
                  </router-link>
                </el-menu-item>
                <el-menu-item index="login" v-show="!loggedIn" style="float: right">
                  <el-link>登录</el-link>
                </el-menu-item>
                <el-menu-item index="register" v-show="!loggedIn" style="float: right">
                  <el-link>注册</el-link>
                </el-menu-item>
                 <div class="flex-grow" />
                <el-menu-item v-if="loggedIn" style="float: right">
                  <current-user class="current-user"></current-user>
                </el-menu-item>
              </el-menu>
            </div>
          </el-header>
        </div>
        <div class="mainWrapper" :class="device">
          <el-col
            :xs="{ span: 24, offset: 0 }"
            :md="{ span: 18, offset: 3 }"
            :lg="{ span: 16, offset: 4 }"
            :xl="{ span: 14, offset: 5 }"
          >
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
          <!-- <el-backtop class="lin-back-top"></el-backtop> -->
        </div>
      </el-col>
    </el-row>
    <login-register-dialog ref="loginRegister"></login-register-dialog>
  </div>
</template>

<script>
import { User as CurrentUser } from '@/component/layout'
import LoginRegisterDialog from '@/view/account/login-register-dialog'
export default {
  name: 'Base',
  components: { CurrentUser, LoginRegisterDialog },
  data() {
    return { activeIndex: '' }
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn
    },
  },
  watch: {
    $route() {
      this.activeIndex = this.$router.path
    },
  },
  created() {
    this.activeIndex = this.$route.path
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (key == 'login' || key == 'register') {
        this.activeIndex = key
        this.$refs['loginRegister'].show(key)
        return
      }
      switch (key) {
        case '/home/index':
          // this.flushCom();
          break
      }
      // this.$router.push(key);
    },
    flushCom: function () {
      this.$router.go(0)
    },
  },
}
</script>
<style lang="scss" scoped>
.headerWrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1501;
}
.mainWrapper {
  height: calc(100% - 80px);
  margin-top: 80px;
  padding-left: 0px;
  width: 100%;
  padding-right: 0px;
  .lin-backtop {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
}
.main-header {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
}
.header-container {
  max-width: 1100px;
  margin: auto;
.flex-grow {
  flex-grow: 1;
}
  :deep(.block) {
    padding: 0px;

    a {
      display: block;
      padding: 0 20px;
    }
  }
  .current-user {
    :deep(.el-dropdown) {
      top: 10px;
      left: 5px;
    }
  }
}
</style>
