<template>
  <div class="container">
    <el-dialog title="编辑分组" :append-to-body="true" v-model="dialogFormVisible">
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style  lang="scss">

</style>
