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
      <template v-slot:renderItem="{item,index}">
        <v-list-item class="item">
          <li slot="actions">
            <follow-button
              :userId="item.follower.id"
              :isFollow="item.is_followed"
              @on-follow="getData"
            ></follow-button>
          </li>
          <v-list-item-meta
            :description="item.follower.introduction?item.follower.introduction:'什么话也没说'"
          >
            <a slot="title" :href="`/user/${item.follower.id}`">{{item.follower.nickname}}</a>
            <el-avatar slot="avatar" icon="el-icon-user" :src="item.follower.avatar" />
          </v-list-item-meta>
        </v-list-item>
      </template>
      <div slot="footer"></div>
    </v-list>
  </div>
</template>

<script>
import followApi from "@/models/follow";
import { FollowButton } from "@/views/follow";
import VList from "@/components/list";
import "@/components/list/index.css";
export default {
  name: "FollowList",
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    FollowButton
  },
  props: {
    userId: {
      type: [String, Number]
    },
    userType: {
      type: [String, Number],
      default: "follow"
    }
  },
  data() {
    return {
      listData: [],
      loading: false,
      pagination: {
        small: false,
        background: true,
        currentPage: 1,
        position: "bottom",
        total: 0,
        currentChange: page => {
          console.log(page);
          this.pagination.currentPage = page;
          this.getData();
        },
        pageSize: 5,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize;
          this.pagination.currentPage = currentPage;
          this.getData();
        }
      }
    };
  },
  async created() {
    await this.getData();
  },
  async activated() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      let res;
      if (this.userType == "follow") {
        res = await followApi.getFollows({
          user_id: this.userId,
          page: this.pagination.currentPage - 1,
          count: this.pagination.pageSize
        });
      } else {
        res = await followApi.getFans({
          user_id: this.userId,
          page: this.pagination.currentPage - 1,
          count: this.pagination.pageSize
        });
      }
      this.listData = res.items;
      this.pagination.total = res.total;
      this.loading = false;
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