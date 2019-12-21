<template>
  <el-button
    :type="!isSubscribe?'primary':'default'"
    icon="el-icon-plus"
    @click="subscribeClick"
    :loading="subscribeLoading"
  >{{isSubscribe?'已关注':'关注他'}}</el-button>
</template>

<script>
import subscribeApi from "@/models/subscribe";
export default {
  name: "SubscribeButton",
  props: {
    userId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      isSubscribe: false,
      subscribeLoading: false
    };
  },
  watch: {
    async userId(newVal, oldVal) {
      await this.getSubscribe();
    }
  },
  async created() {
    await this.getSubscribe();
  },
  computed: {},
  methods: {
    async getSubscribe() {
      if (this.userId == 0) return;
      this.isSubscribe = await subscribeApi.getSubscribe({
        subscribeUserId: this.userId
      });
    },
    async subscribe() {
      await subscribeApi.addSubscribe({
        subscribeUserId: this.userId
      });
      this.isSubscribe = true;
    },
    async unsubscribe() {
      await subscribeApi.deleteSubscribe({
        subscribeUserId: this.userId
      });
      this.isSubscribe = false;
    },
    subscribeClick() {
      this.subscribeLoading = true;
      this.isSubscribe ? this.unsubscribe() : this.subscribe();
      this.subscribeLoading = false;
    }
  }
};
</script>

<style>
</style>