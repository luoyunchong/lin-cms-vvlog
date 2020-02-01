<template>
  <el-button
    :type="!is_subscribeed?'primary':'default'"
    icon="el-icon-plus"
    @click="subscribeClick"
    :loading="subscribeLoading"
    size="medium"
  >{{is_subscribeed?'已关注':'关注他'}}</el-button>
</template>

<script>
import subscribeApi from "@/models/subscribe";
export default {
  name: "SubscribeButton",
  props: {
    userId: {
      type: [String, Number],
      default: 0
    },
    is_subscribeed: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
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
      if (this.is_subscribeed == null) {
        let is_subscribeed = await subscribeApi.getSubscribe({
          subscribeUserId: this.userId
        });
        this.$emit("subscribe", is_subscribeed);
      }
    },
    async subscribe() {
      await subscribeApi.addSubscribe({
        subscribeUserId: this.userId
      });
      this.$emit("subscribe", true);
    },
    async unsubscribe() {
      await subscribeApi.deleteSubscribe({
        subscribeUserId: this.userId
      });
      this.$emit("subscribe", false);
    },
    subscribeClick() {
      this.subscribeLoading = true;
      this.is_subscribeed ? this.unsubscribe() : this.subscribe();
      this.subscribeLoading = false;
    }
  }
};
</script>

<style>
</style>