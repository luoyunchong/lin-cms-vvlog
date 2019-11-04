<template>
  <el-row>
    <el-col
      :xs=" {span: 24, offset: 0}"
      :md="{span:18,offset:3}"
      :lg=" {span: 14, offset: 5}"
      :xl="{span: 12, offset: 6}"
    >
      <el-container>
        <div class="headerWrapper">
          <el-header style="padding:0;background:#fff;" class="main-header">
            <div class="container">
              <el-menu
                default-active="1"
                mode="horizontal"
                @select="handleSelect"
                router
                background-color="#fff"
                active-text-color="#007fff"
              >
                <el-menu-item index="1" :route="{path:'/home/index'}">首页</el-menu-item>
                <el-menu-item index="2" :route="{path:'/home/docs'}">文档</el-menu-item>
              </el-menu>
            </div>
          </el-header>
        </div>
        <div class="mainWrapper">
          <section class="container">
            <div class="wrapper" id="wrapper">
              <transition name="fade-transform" mode="out-in">
                <router-view></router-view>
              </transition>
            </div>
          </section>
        </div>
      </el-container>
    </el-col>
  </el-row>

  <!-- <div class="app-container">
    <el-container>
      <div class="headerWrapper">
        <el-header style="padding:0;background:#fff;" class="main-header">
          <div class="container">
            <el-menu active-text-color="#007fff" mode="horizontal" @select="handleSelect" router>
              <el-menu-item index="1" :route="{path:'/home/index'}">首页</el-menu-item>
              <el-menu-item index="2" :route="{path:'/home/docs'}">文档</el-menu-item>
            </el-menu>
          </div>
        </el-header>
      </div>
      <div class="mainWrapper">
        <section class="container">
          <div class="wrapper" id="wrapper">
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </section>
      </div>
    </el-container>
  </div>-->
</template>

<script>
export default {
  name: "Base",
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
  z-index: 10000;
}
.mainWrapper {
  height: calc(100% - 80px);
  margin-top: 80px;
  padding-left: 0px;
  padding-right: 0px;
}
.main-header {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
  height: 5rem;
  z-index: 250;
}
.container {
  max-width: 1100px;
  margin: auto;
  height: 100%;
}
</style>