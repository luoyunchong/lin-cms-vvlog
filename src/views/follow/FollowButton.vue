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
    }
  },
  data() {
    return {
      isFollow: false,
      followLoading: false
    };
  },
  watch: {
    async userId(newVal, oldVal) {
      await this.getFollow();
    }
  },
  async created() {
    await this.getFollow();
  },
  computed: {},
  methods: {
    async getFollow() {
      if (this.userId == 0) return;
      this.isFollow = await followApi.getFollow({
        followUserId: this.userId
      });
    },
    async follow() {
      await followApi.addFollow({
        followUserId: this.userId
      });
      this.isFollow = true;
    },
    async unfollow() {
      await followApi.deleteFollow({
        followUserId: this.userId
      });
      this.isFollow = false;
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