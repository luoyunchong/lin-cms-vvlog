<template>
  <el-button
    :type="!isFollow?'primary':'default'"
    icon="el-icon-plus"
    @click="followClick"
    :loading="followLoading"
  >{{isFollow?'已关注':'关注他'}}</el-button>
</template>

<script>
import followApi from "@/models/follow";
export default {
  name: "FollowButton",
  props: {
    userId: {
      type: [String, Number],
      default: 0
    },
    isFollow: {
      type: [Boolean],
      default: false
    }
  },

  data() {
    return {
      followLoading: false
    };
  },
  computed: {},
  methods: {
    async follow() {
      await followApi.addFollow({
        followUserId: this.userId
      });
      this.$emit("on-follow", true);
      // this.isFollow = true;
    },
    async unfollow() {
      await followApi.deleteFollow({
        followUserId: this.userId
      });
      this.$emit("on-follow", false);
      // this.isFollow = false;
    },
    followClick() {
      this.followLoading = true;
      this.isFollow ? this.unfollow() : this.follow();
      this.followLoading = false;
    }
  }
};
</script>

<style>
</style>