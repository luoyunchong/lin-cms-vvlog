<template>
  <div>
    <v-list
      itemLayout="horizontal"
      :dataSource="listData"
      :bordered="false"
      v-loading="loading"
      class="list"
      :pagination="pagination"
    >
      <template v-slot:renderItem="{ item, index }">
        <v-list-item class="item">
          <template #actions>
            <li v-show="showActions">
              <subscribe-tag-button
                :index="index"
                :tag_id="item.id"
                :is_subscribe="item.is_subscribe"
                @subscribe="subscribe"
                @unsubscribe="unsubscribe"
              ></subscribe-tag-button>
            </li>
          </template>

          <v-list-item-meta>
            <template #description>
              <span class="fn-ellpisis1">{{ item.remark }}</span>
            </template>
            <template #title>
              <router-link :to="{ path: `/tag/${item.id}` }" target="_blank">{{ item.tag_name }}</router-link>
            </template>
            <!-- <a slot="title" :href="`/tag/${item.id}`" target="_blank">{{item.tag_name}}</a> -->
            <template #avatar>
              <el-avatar :src="item.thumbnail_display">
                <!-- ||defaultAvatar -->
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
            </template>
          </v-list-item-meta>
        </v-list-item>
      </template>
      <template #footer></template>
    </v-list>
  </div>
</template>

<script>
import { SubscribeTagButton } from '@/view/subscribe'
import VList from '@/component/list'
import '@/component/list/index.css'
import defaultAvatar from '@/assets/image/user/user.png'
import userTagApi from '@/model/user-tag'

export default {
  name: 'SubscribeTagList',
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    SubscribeTagButton,
  },
  props: {
    userId: {
      type: [String, Number],
    },
    userType: {
      type: [String, Number],
      default: 'subscribe',
    },
    showActions: {
      type: [Boolean],
      default: true,
    },
  },
  data() {
    return {
      listData: [],
      loading: false,
      pagination: {
        small: false,
        background: true,
        currentPage: 1,
        position: 'bottom',
        total: 0,
        currentChange: page => {
          console.log(page)
          this.pagination.currentPage = page
          this.getData()
        },
        pageSize: 15,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize
          this.pagination.currentPage = currentPage
          this.getData()
        },
      },
      defaultAvatar,
      subscribeLoading: false,
    }
  },
  async created() {
    await this.getData()
  },
  async activated() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      let res
      res = await userTagApi.getSubscribeTags({
        userId: this.userId,
        page: this.pagination.currentPage - 1,
        count: this.pagination.pageSize,
      })

      this.listData = res.items
      this.pagination.count = res.count
      this.$emit('success', res.count)
      this.loading = false
    },
    async subscribe(index) {
      this.listData[index].is_subscribe = true
      this.$emit('subscribe', 1)
    },
    async unsubscribe(index) {
      this.listData[index].is_subscribe = false
      this.$emit('subscribe', -1)
    },
  },
}
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
