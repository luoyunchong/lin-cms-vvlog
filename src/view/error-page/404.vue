<template>
  <div class="container"
    ref="container">
    <img class="page-404"
      src="../../assets/image/error-page/404.png"
      alt="" />
    <router-link to="/index">
      <el-button type="primary"
        class="back-button">回到首页</el-button>
    </router-link>
    <img class="page-logo"
      src="../../assets/image/error-page/logo.png"
      alt="" />
  </div>
</template>

<script type="text/ecmascript-6">
import { getCurrentInstance, onMounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      const headerHeight = 72
      const { clientHeight } = document.body

      const ctx = getCurrentInstance()
      ctx.refs.container.style.height = `${clientHeight - headerHeight}px`
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .page-404 {
    width: 349px;
    height: 190px;
  }
  .page-logo {
    position: absolute;
    right: 40px;
    bottom: 40px;
    width: 60px;
    height: 98px;
  }
  .back-button {
    padding: 1.1rem 2rem;
    font-size: 1.4rem;
  }
}
</style>
