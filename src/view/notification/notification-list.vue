<template>
  <div class="container">
    <v-list :dataSource="listData" :bordered="false" v-loading="loading" itemLayout="vertical" :pagination="pagination">
      <template v-slot:renderItem="{ item }">
        <v-list-item>
          <v-list-item-meta :description="$filters.filterTimeYmdHms(item.create_time)">
            <template #title>
              <div class="info" v-show="item.notification_type == 0">
                <router-link :to="{ path: `/user/${item.user_info_id}/article` }" target="_blank" class="user_link">
                  {{ item.user_info != null ? item.user_info.nickname : '' }}</router-link>
                <span>点赞了你的随笔</span>
                <router-link v-if="item.article_entry != null" :to="{ path: `/p/${item.article_entry.id}` }"
                  target="_blank">《{{ item.article_entry.title }}》</router-link>
              </div>

              <div class="info" v-show="item.notification_type == 1">
                <router-link :to="{ path: `/user/${item.user_info_id}` }" target="_blank" class="user_link">{{
                    item.user_info != null ? item.user_info.nickname : ''
                }}</router-link>在随笔
                <router-link v-if="item.article_entry != null" :to="{ path: `/p/${item.article_entry.id}` }"
                  target="_blank">《{{ item.article_entry.title }}》</router-link>点赞了你的评论
              </div>

              <div class="info" v-show="item.notification_type == 2">
                <router-link :to="{ path: `/user/${item.user_info_id}/article` }" target="_blank" class="user_link">{{
                    item.user_info != null ? item.user_info.nickname : ''
                }}</router-link>评论了你的随笔
                <router-link v-if="item.article_entry != null" :to="{ path: `/p/${item.article_entry.id}` }"
                  target="_blank">《{{ item.article_entry.title }}》</router-link>
              </div>
              <div class="info" v-show="item.notification_type == 4">
                <router-link :to="{ path: `/user/${item.user_info_id}/article` }" target="_blank" class="user_link">{{
                    item.user_info != null ? item.user_info.nickname : ''
                }}</router-link>关注了你
              </div>
            </template>
            <template #avatar>
              <div>
                <el-avatar :src="item.user_info != null ? item.user_info.avatar : defaultAvatar" />
              </div>
            </template>
          </v-list-item-meta>
          <template #content>{{ item.comment_entry != null ? item.comment_entry.text : '' }}</template>
          <template #actions>
            <li v-show="item.notification_type == 1 || item.notification_type == 2">
              <router-link v-if="item.article_entry != null && item.comment_entry != null"
                :to="{ path: `/p/${item.article_entry.id}#comment-list-${item.comment_entry.id}` }" target="_blank">
                <span>
                  <i class="iconfont icon-comment"></i>
                  查看对话
                </span>
              </router-link>
            </li>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import notificationApi from '../../model/notification'
import VList from '@/component/list'
import '@/component/list/index.css'
import defaultAvatar from '@/assets/image/user/user.png'
export default {
  name: 'NotificationList',
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
  },
  data() {
    return {
      pagination: {
        small: false,
        background: true,
        currentPage: 1,
        position: 'bottom',
        total: 0,
        currentChange: page => {
          console.log(page)
          this.pagination.currentPage = page
          this.getNotifications()
        },
        pageSize: 15,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize
          this.pagination.currentPage = currentPage
          this.getNotifications()
        },
      },
      listData: [],
      loading: false,
      defaultAvatar,
    }
  },
  props: {
    notification_type: {
      type: Number,
      default: 1,
    },
  },
  async created() {
    await this.getNotifications()
  },
  watch: {
    notification_type(newVal, oldVal) {
      this.pagination.currentPage = 1
      this.getNotifications()
    },
  },
  methods: {
    async getNotifications() {
      this.loading = true
      const currentPage = this.pagination.currentPage - 1
      let res = await notificationApi
        .getNotifications({
          count: this.pagination.pageSize,
          page: currentPage,
          notification_search_type: this.notification_type,
        })
        .finally(r => {
          this.loading = false
        })
      this.listData = res.items
      this.pagination.count = res.count
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 1px 30px;

  .info {
    .user_link {
      margin-right: 8px;
      font-weight: bold;
    }

    a {
      font-size: 15px;
      color: #3194d0;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.vv-list .vv-list-vertical .vv-list-item-content {
  font-size: 15px !important;
}
</style>
