<template>
  <div class="container">
    <v-list
      :dataSource="listData"
      :bordered="false"
      v-loading="loading"
      itemLayout="vertical"
      :pagination="pagination"
    >
      <template v-slot:renderItem="{item,index}">
        <v-list-item>
          <v-list-item-meta :description="item.create_time|filterTimeYmdHms">
            <div slot="title" class="info" v-show="item.notification_type==0">
              <a
                :href="`/user/${item.user_info_id}/article`"
                target="_blank"
              >{{(item.user_info!=null?item.user_info.nickname:'')}}</a>
              点赞了你的随笔
              <a
                v-if="item.article_entry!=null"
                :href="`/post/${item.article_entry.id}`"
                target="_blank"
              >《{{item.article_entry.title}}》</a>
            </div>
            <div slot="title" class="info" v-show="item.notification_type==1">
              <a
                :href="`/user/${item.user_info_id}/article`"
                target="_blank"
              >{{(item.user_info!=null?item.user_info.nickname:'')}}</a>
              在随笔
              <a
                v-if="item.article_entry!=null"
                :href="`/post/${item.article_entry.id}`"
                target="_blank"
              >《{{item.article_entry.title}}》</a>
              点赞了你的评论
            </div>
            <div slot="title" class="info" v-show="item.notification_type==2">
              <a
                :href="`/user/${item.user_info_id}/article`"
                target="_blank"
              >{{(item.user_info!=null?item.user_info.nickname:'')}}</a>
              评论了你的文章
              <a
                v-if="item.article_entry!=null"
                :href="`/post/${item.article_entry.id}`"
                target="_blank"
              >《{{item.article_entry.title}}》</a>
            </div>
            <el-avatar slot="avatar" :src="item.user_info.avatar" />
          </v-list-item-meta>
          <template slot="content">{{item.comment_entry!=null?item.comment_entry.text:''}}</template>
          <li slot="actions" v-show="item.notification_type==1||item.notification_type==2">
            <a
              v-if="item.article_entry!=null&&item.comment_entry!=null"
              :href="`/post/${item.article_entry.id}#comment-list-${item.comment_entry.id}`"
              target="_blank"
            >
              <span>
                <i class="iconfont icon-comment"></i>
                查看对话
              </span>
            </a>
          </li>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>


<script>
import notificationApi from "../../models/notification";
import VList from "@/components/list";
import "@/components/list/index.css";
export default {
  name: "NotificationList",
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta
  },
  data() {
    return {
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0
      },
      listData: [],
      loading: false
    };
  },
  props: {
    notification_type: {
      type: Number,
      default: 1
    }
  },
  async created() {
    await this.getNotifications();
  },
  watch: {
    notification_type(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.pagination.currentPage = 0;
      this.getNotifications();
    }
  },
  methods: {
    async getNotifications() {
      this.loading = true;
      const currentPage = this.pagination.currentPage;
      let res = await notificationApi
        .getNotifications({
          count: this.pagination.pageSize,
          page: currentPage,
          notification_search_type: this.notification_type
        })
        .finally(r => {
          this.loading = false;
        });
      this.listData = res.items;
      this.pagination.currentPage += 1;
      this.pagination.pageTotal = res.total;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 1px 30px;
  .info {
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