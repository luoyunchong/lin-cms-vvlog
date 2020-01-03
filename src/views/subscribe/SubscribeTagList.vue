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
          <li slot="actions" v-show="showActions">
            <!-- <subscribe-button
              :userId="item.subscribeer.id"
              :isSubscribe="item.is_subscribeed"
              @on-subscribe="getData"
            ></subscribe-button>-->
          </li>
          <v-list-item-meta>
            <a slot="title" :href="`/tag/${item.id}`" target="_blank">{{item.tag_name}}</a>
            <el-avatar
              slot="avatar"
              shape="square"
              icon="el-icon-user"
              :src="item.thumbnail_display||defaultAvatar"
            />
          </v-list-item-meta>
        </v-list-item>
      </template>
      <div slot="footer"></div>
    </v-list>
  </div>
</template>

<script>
import userTagApi from "@/models/userTag";
import { SubscribeButton } from "@/views/subscribe";
import VList from "@/components/list";
import "@/components/list/index.css";
import defaultAvatar from "@/assets/img/user/user.png";

export default {
  name: "SubscribeTagList",
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    SubscribeButton
  },
  props: {
    userId: {
      type: [String, Number]
    },
    userType: {
      type: [String, Number],
      default: "subscribe"
    },
    showActions: {
      type: [Boolean],
      default: true
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
        pageSize: 15,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize;
          this.pagination.currentPage = currentPage;
          this.getData();
        }
      },
      defaultAvatar
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
      res = await userTagApi.getSubscribeTags({
        userId: this.userId,
        page: this.pagination.currentPage - 1,
        count: this.pagination.pageSize
      });

      this.listData = res.items;
      this.pagination.total = res.total;
      this.$emit("success", res.total);
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