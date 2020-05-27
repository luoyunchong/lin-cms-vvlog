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
            <subscribe-button
              :userId="item.subscribeer.id"
              :is_subscribeed="item.is_subscribeed"
              @subscribe="(is_subscribeed)=>subscribe(is_subscribeed,index)"
            ></subscribe-button>
          </li>
          <v-list-item-meta
            :description="item.subscribeer.introduction?item.subscribeer.introduction:'什么话也没说'"
          >
            <router-link
              slot="title"
              :to="{path:`/user/${item.subscribeer.id}/article`}"
              target="_blank"
            >{{item.subscribeer.nickname}}</router-link>

            <!-- <a
              slot="title"
              :href="`/user/${item.subscribeer.id}/article`"
              target="_blank"
            >{{item.subscribeer.nickname}}</a>-->
            <el-avatar slot="avatar" :src="item.subscribeer.avatar">
              <!-- icon="el-icon-user" -->
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
          </v-list-item-meta>
        </v-list-item>
      </template>
      <div slot="footer"></div>
    </v-list>
  </div>
</template>

<script>
import subscribeApi from "@/model/subscribe";
import { SubscribeButton } from "@/view/subscribe";
import VList from "@/component/list";
import "@/component/list/index.css";
import defaultAvatar from "@/assets/img/user/user.png";

export default {
  name: "SubscribeUserList",
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
      if (this.userType == "subscribe") {
        res = await subscribeApi.getSubscribes({
          user_id: this.userId,
          page: this.pagination.currentPage - 1,
          count: this.pagination.pageSize
        });
      } else {
        res = await subscribeApi.getFans({
          user_id: this.userId,
          page: this.pagination.currentPage - 1,
          count: this.pagination.pageSize
        });
      }
      this.listData = res.items;
      this.pagination.total = res.total;
      this.$emit("success", res.total);
      this.loading = false;
    },
    subscribe(is_subscribeed, index) {
      this.listData[index].is_subscribeed = is_subscribeed;
      this.$emit("subscribe", is_subscribeed ? 1 : -1);
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