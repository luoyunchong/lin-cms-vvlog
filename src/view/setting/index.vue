<template>
  <el-container style="height: 800px">
    <el-header class="vv-header">
      <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="true">
        <el-menu-item index="/setting/profile">个人资料</el-menu-item>
        <el-menu-item index="/setting/security">安全设置</el-menu-item>
        <el-menu-item index="/setting/binding">第三方帐号绑定</el-menu-item>
        <el-menu-item index="/setting/blog">博客设置</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside class="vv-aside" width="190px">
        <el-menu class="el-menu-profile" :default-active="activeIndex" :router="true">
          <el-menu-item-group>
            <template #title>设置</template>
            <el-menu-item index="/setting/profile">个人资料</el-menu-item>
            <el-menu-item index="/setting/security">安全设置</el-menu-item>
            <el-menu-item index="/setting/binding">第三方帐号绑定</el-menu-item>
            <el-menu-item index="/setting/blog">博客设置</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main class="vv-main">
        <div class="vv-main-title">
          <h1>{{ $route.meta.title }}</h1>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.vv-aside {
  background: #fff;
  overflow-x: hidden;
  border-right: 1px solid #ebebeb;
}

.vv-header {
  display: none;
}

.vv-main {
  background: #fff;
  padding: 0px;

  .vv-main-title {
    margin: 20px 0px 0px 20px;

    span {
      line-height: 1.4;
      font-size: 19px;
    }
  }
}

@media (max-width: 600px) {
  .vv-aside {
    display: none;
  }

  .vv-header {
    padding-left: 0px;
    display: flex;
  }
}
</style>

<script>
import './index.scss'
export default {
  name: 'SettingsIndex',
  data() {
    return {
      activeIndex: '',
    }
  },
  created() {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route(newVal) {
      this.activeIndex = this.$route.path
    },
  },
}
</script>
