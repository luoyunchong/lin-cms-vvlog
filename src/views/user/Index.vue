<template>
  <div style="background:#fff;padding: 26px 24px ">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="关注" name="follow">
        <follow-list :userId="userId" userType="follow" v-if="activeName=='follow'"></follow-list>
      </el-tab-pane>
      <el-tab-pane label="粉丝" name="fans">
        <follow-list :userId="userId" userType="fans" v-if="activeName=='fans'"></follow-list>
        <!-- v-if="name=='fans'" -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { FollowList } from "@/views/follow";
export default {
  name: "UserIndex",
  components: { FollowList },
  data() {
    return {
      activeName: "follow"
    };
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  async created() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab.name);
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  .item {
    cursor: pointer;
    padding-left: 10px;
    &:hover {
      background: #e6f7ff;
    }
  }
}
</style>