<template>
  <el-button
    :type="!subscribeed ? 'default' : 'primary'"
    @click="subscribeClick"
    :loading="subscribeLoading"
    size="default"
  >
    <el-icon class="el-icon--left"><Plus /></el-icon>
    {{ subscribeed ? '已关注' : '关注他' }}
   </el-button>
</template>

<script>
import subscribeApi from '@/model/subscribe'
export default {
  name: 'SubscribeButton',
  props: {
    userId: {
      type: [String, Number],
      default: 0,
    },
    is_subscribeed: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      subscribeLoading: false,
      subscribeed: false,
    }
  },
  watch: {
    async userId(newVal, oldVal) {
      await this.getSubscribe()
    },
  },
  async created() {
    this.subscribeed = this.is_subscribeed
    await this.getSubscribe()
  },
  computed: {},
  methods: {
    async getSubscribe() {
      if (this.userId == 0) return
      if (this.is_subscribeed == null) {
        let subscribeed = await subscribeApi.getSubscribe({
          subscribeUserId: this.userId,
        })
        this.subscribeed = subscribeed
        this.$emit('subscribe', subscribeed)
      }
    },
    async subscribe() {
      await subscribeApi.addSubscribe({
        subscribeUserId: this.userId,
      })
      this.subscribeed = true
      this.$emit('subscribe', true)
    },
    async unsubscribe() {
      await subscribeApi.deleteSubscribe({
        subscribeUserId: this.userId,
      })
      this.subscribeed = false
      this.$emit('subscribe', false)
    },
    subscribeClick() {
      this.subscribeLoading = true
      this.subscribeed ? this.unsubscribe() : this.subscribe()
      this.subscribeLoading = false
    },
  },
}
</script>

<style></style>
