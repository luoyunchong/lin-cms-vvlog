<template>
  <div>
    <el-row>
      <el-col>
        <div class="headerWrapper">
          <el-header class="main-header">
            <div class="header-container">
              <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                class="header-menu-desktop"
                :ellipsis="false"
                @select="handleSelect"
              >
                <el-menu-item index="/index" class="block">
                  <router-link :to="{ path: '/index' }">
                    <i class="el-icon-help"></i>
                    首页
                  </router-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn" index="/subscribe" class="block">
                  <router-link :to="{ path: '/subscribe' }">
                    <el-icon> <ScaleToOriginal /> </el-icon>关注
                  </router-link>
                </el-menu-item>
                <el-menu-item index="/tag/subscribe/all" class="block">
                  <router-link :to="{ path: '/tag/subscribe/all' }">
                    <el-icon> <CopyDocument /> </el-icon>标签
                  </router-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn" index="/notification/userComment" class="block">
                  <router-link :to="{ path: '/notification/userComment' }">
                    <el-icon> <Bell /> </el-icon>消息
                  </router-link>
                </el-menu-item>
                <el-menu-item index="https://igeekfan.cn/cms/" class="block">
                  <a href="https://igeekfan.cn/cms/" target="_blank">
                    <el-icon> <Van /> </el-icon>CMS
                  </a>
                </el-menu-item>
                <div class="flex-grow" />
                <el-menu-item index="login" v-show="!loggedIn">
                  <el-link>登录</el-link>
                </el-menu-item>
                <el-menu-item index="register" v-show="!loggedIn">
                  <el-link>注册</el-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn">
                  <current-user class="current-user"></current-user>
                </el-menu-item>
              </el-menu>
              <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                :ellipsis="false"
                @select="handleSelect"
                class="header-menu-mobile"
              >
                <el-menu-item index="index">
                  <el-dropdown size="large" class="header-dropdown" @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{ activeValue }}
                      <el-icon class="el-icon--right">
                        <arrow-down />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="/index">首页</el-dropdown-item>
                        <el-dropdown-item command="/subscribe" v-if="loggedIn">关注 </el-dropdown-item>
                        <el-dropdown-item command="/tag/subscribe/all">标签</el-dropdown-item>
                        <el-dropdown-item command="/notification/userComment" v-if="loggedIn">消息 </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-menu-item>

                <div class="flex-grow" />
                <el-menu-item index="login" v-show="!loggedIn">
                  <el-link>登录</el-link>
                </el-menu-item>
                <el-menu-item index="register" v-show="!loggedIn">
                  <el-link>注册</el-link>
                </el-menu-item>
                <el-menu-item v-if="loggedIn">
                  <current-user class="current-user"></current-user>
                </el-menu-item>
              </el-menu>
            </div>
          </el-header>
        </div>
        <div class="mainWrapper" :class="device">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
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
    return {}
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn
    },
    activeIndex() {
      if (this.$route.path === '/') {
        return '/index'
      }
      return this.$route.path
    },
    activeValue() {
      switch (this.activeIndex) {
        case '/index':
          return '首页'
        case '/subscribe':
          return '关注'
        case '/tag/subscribe/all':
          return '标签'
        case '/notification/userComment':
          return '消息'
        default:
          return '首页'
      }
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
    flushCom() {
      this.$router.go(0)
    },
    handleCommand(command) {
      if (command == 'login' || command == 'register') {
        this.$refs['loginRegister'].show(command)
        return
      }
      this.$router.push(command)
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
  padding-left: 0px;
  max-width: 1200px;
  padding-right: 0px;
  margin: 80px auto;

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

.header-menu-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .header-menu-desktop {
    display: none;
  }

  .header-menu-mobile {
    display: flex;
  }

  .header-menu-mobile {
    .header-dropdown {
      height: 57px;
      line-height: 60px;
      cursor: pointer;
    }
  }
}
</style>
