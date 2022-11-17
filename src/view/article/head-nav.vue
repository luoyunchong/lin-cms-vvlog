<template>
  <div>
    <el-row>
      <el-col>
        <div class="headerWrapper">
          <el-header style="padding: 0; background: #fff" class="main-header">
            <div class="header-container">
              <el-menu :default-active="activeIndex" :ellipsis="false" mode="horizontal" @select="handleSelect">
                <!-- text-color="#000"
                  background-color="#fff"
                active-text-color="#ffd04b"-->
                <el-menu-item index="/index" class="block">
                  <router-link :to="{ path: '/index' }">
                    <i class="el-icon-help"></i>
                    首页
                  </router-link>
                </el-menu-item>
                <el-menu-item index="/tag/subscribe/all" class="block">
                  <router-link :to="{ path: '/tag/subscribe/all' }">
                    <el-icon> <CopyDocument /> </el-icon>标签
                  </router-link>
                </el-menu-item>
                <div class="flex-grow" />
                <el-menu-item index="login" v-show="!loggedIn">
                  <el-link>登录</el-link>
                </el-menu-item>
                <el-menu-item index="register" v-show="!loggedIn">
                  <el-link>注册</el-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn" index="post">
                  <div style="height: 100%">
                    <el-button type="primary" @click="confirmEdit()" plain style="margin-top: 15px">
                      <el-icon class="el-icon--left"> <Edit /> </el-icon>发布随笔</el-button
                    >
                  </div>
                </el-menu-item>
                <el-menu-item v-if="loggedIn" index="current-user">
                  <current-user class="current-user"></current-user>
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
    async confirmEdit() {
      this.$emit('confirmEdit')
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
}
.main-header {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
}
.header-container {
  max-width: 1440px;
  margin: auto;
  height: 100%;
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
