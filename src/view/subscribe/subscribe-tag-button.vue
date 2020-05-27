<template>
  <el-button
    :type="!is_subscribe?'default':'primary'"
    icon="el-icon-plus"
    @click="subscribeClick"
    :loading="subscribeLoading"
    size="medium"
  >{{is_subscribe?'已关注':'关注'}}</el-button>
</template>

<script>
import userTagApi from "@/model/user-tag";
export default {
  name: "SubscribeTagButton",
  props: {
    index: Number,
    tag_id: {
      type: [String, Number],
      default: 0
    },
    is_subscribe: Boolean
  },
  data() {
    return {
      subscribeLoading: false
    };
  },
  watch: {},
  async created() {},
  computed: {},
  methods: {
    async subscribe() {
      await userTagApi.addSubscribeTag({
        tagId: this.tag_id
      });
      this.$emit("subscribe", this.index);
    },
    async unsubscribe() {
      await userTagApi.deleteSubscribeTag({
        tagId: this.tag_id
      });
      this.$emit("unsubscribe", this.index);
    },
    subscribeClick() {
      this.subscribeLoading = true;
      this.is_subscribe ? this.unsubscribe() : this.subscribe();
      this.subscribeLoading = false;
    }
  }
};
</script>

<style>
</style>