<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="全部标签" name="all">
        <el-row :gutter="24" style="margin-left:0px;margin-right:0px;">
          <el-col :span="24">
            <el-card shadow="never" style="margin-bottom:10px;border-radius: 8px;">
              <el-form :inline="true" size="small" :model="form" class="demo-form-inline">
                <el-form-item>
                  <router-link :to="{ path: '/tag/subscribe/all/hottest' }"
                    :class="sortName == 'hottest' ? 'el-link el-link--primary is-underline' : 'el-link el-link--info'">
                    最热
                  </router-link>
                  <el-divider direction="vertical"></el-divider>
                  <router-link :to="{ path: '/tag/subscribe/all/newest' }"
                    :class="sortName == 'newest' ? 'el-link el-link--primary is-underline' : 'el-link el-link--info'">最新
                  </router-link>
                </el-form-item>
                <el-form-item class="search-input">
                  <el-input v-model="form.tag_name" placeholder="根据标签名查询/回车查询" clearable size="small"
                    @keyup.enter.native="refresh" @clear="refresh"></el-input>
                </el-form-item>
                <el-form-item class="search-button">
                  <el-button type="primary" @click="refresh">查询</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="6" :xs="12" :md="6" v-for="(item, index) in dataSource" :key="index">
            <tag-item :index="index" :subscribers_count="item.subscribers_count" :article_count="item.article_count"
              :id="item.id" :tag_name="item.tag_name" :thumbnail_display="item.thumbnail_display"
              :view_hits="item.view_hits" :is_subscribe="item.is_subscribe" v-on:addSubscribeTag="addSubscribeTag"
              v-on:deleteSubscribeTag="deleteSubscribeTag"></tag-item>
          </el-col>
        </el-row>
        <infinite-loading @infinite="infiniteHandler" :identifier="any" distance="50">
          <template #spinner>
            <el-divider class="lin-divider">加载中...</el-divider>
          </template>
          <template #complete>
            <el-divider class="lin-divider">我也是有底线的...</el-divider>
          </template>
        </infinite-loading>

      </el-tab-pane>
      <el-tab-pane label="已关注标签" name="subscribe" v-if="loggedIn">
        <el-row :gutter="24" style="margin-left:0px;margin-right:0px;">
          <el-col :span="6" :xs="12" :md="6" v-for="(item, index) in subscribeDataSource" :key="index">
            <tag-item :index="index" :subscribers_count="item.subscribers_count" :article_count="item.article_count"
              :id="item.id" :tag_name="item.tag_name" :thumbnail_display="item.thumbnail_display"
              :is_subscribe="item.is_subscribe" :status="item.status" v-on:addSubscribeTag="addSubscribeDataTag"
              v-on:deleteSubscribeTag="deleteSubscribeDataTag"></tag-item>
          </el-col>
        </el-row>
        <infinite-loading @infinite="infiniteHandlerSubscribe" :identifier="anySubscribe" distance="50">
          <template #spinner>
            <el-divider class="lin-divider">加载中...</el-divider>
          </template>
          <template #complete>
            <el-divider class="lin-divider">我也是有底线的...</el-divider>
          </template>
        </infinite-loading>
      </el-tab-pane>
    </el-tabs>
    <el-backtop class="lin-back-top"></el-backtop>
  </div>
</template>

<script>
import tagApi from "@/model/tag";
import userTagApi from "@/model/user-tag";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import TagItem from "@/view/tag/tag-item";
export default {
  components: { InfiniteLoading, TagItem },
  name: "TagList",
  data() {
    return {
      count: 20,
      dataSource: [],
      subscribeDataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 15,
        pageTotal: 0
      },
      paginationSubscribe: {
        currentPage: 0,
        pageSize: 15,
        pageTotal: 0
      },
      loading: false,
      any: new Date(),
      anySubscribe: new Date(),
      form: {
        tag_name: ""
      },
      activeName: "subscribe",
      sortName: "hottest"
    };
  },
  computed: {
    sort() {
      return this.$route.params.sort;
    },
    tab() {
      return this.$route.params.tab;
    },
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },
  watch: {
    sort() {
      this.sortName = this.sort;
      this.refresh();
    }
  },
  created() {
    this.refreshSubscribe();
    // this.refresh();

    if (this.loggedIn != true) {
      this.activeName = "all";
    }
    this.activeName = this.tab;
    if (this.sort == undefined) {
      this.sortName = "hottest";
    } else {
      this.sortName = this.sort;
    }
  },
  activated() {
    this.activeName = this.tab;
    if (this.sort == undefined) {
      this.sortName = "hottest";
    } else {
      this.sortName = this.sort;
    }
  },
  methods: {
    tabChange(tab, event) {
      if (tab.paneName == "subscribe") {
        this.refreshSubscribe();
      } else {
        this.refresh();
      }
    },
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    async refreshSubscribe() {
      this.paginationSubscribe.currentPage = 0;
      this.anySubscribe = new Date();
      await this.infiniteHandlerSubscribe();
    },
    async infiniteHandler($state) {
      let res;
      const currentPage = this.pagination.currentPage;
      let sort = this.sortName;
      if (sort == "hottest") {
        sort = "article_count desc";
      } else {
        sort = "create_time desc";
      }

      res = await tagApi.getTags({
        count: this.pagination.pageSize,
        page: currentPage,
        tag_name: this.form.tag_name,
        sort: sort
      });
      let items = [...res.items];

      if (items.length == 0) {
        $state && $state.complete();
        if (currentPage == 0) {
          this.dataSource = items;
          this.pagination.currentPage += 1;
          this.pagination.pageTotal = res.count;
        }
      } else {
        if (currentPage == 0) {
          this.dataSource = items;
        } else {
          this.dataSource = this.dataSource.concat(items);
        }
        this.pagination.currentPage += 1;
        this.pagination.pageTotal = res.count;

        $state && $state.loaded();
      }
    },
    addSubscribeDataTag(index) {
      this.subscribeDataSource[index].is_subscribe = true;
      this.subscribeDataSource[index].subscribers_count += 1;
    },
    deleteSubscribeDataTag(index) {
      this.subscribeDataSource[index].is_subscribe = false;
      if (this.subscribeDataSource[index].subscribers_count > 1)
        this.subscribeDataSource[index].subscribers_count -= 1;
    },
    addSubscribeTag(index) {
      this.dataSource[index].is_subscribe = true;
      this.dataSource[index].subscribers_count += 1;
    },
    deleteSubscribeTag(index) {
      this.dataSource[index].is_subscribe = false;
      if (this.dataSource[index].subscribers_count > 1)
        this.dataSource[index].subscribers_count -= 1;
    },
    async infiniteHandlerSubscribe($state) {
      var user = this.$store.state.user;
      const currentPage = this.paginationSubscribe.currentPage;
      let res = await userTagApi.getSubscribeTags({
        count: this.paginationSubscribe.pageSize,
        page: currentPage,
        user_id: user.id,
      });

      let items = [...res.items];

      if (items.length == 0) {
        $state && $state.complete();
        if (currentPage == 0) {
          this.subscribeDataSource = items;
          this.paginationSubscribe.currentPage += 1;
          this.paginationSubscribe.pageTotal = res.count;
        }
      } else {
        if (currentPage == 0) {
          this.subscribeDataSource = items;
        } else {
          this.subscribeDataSource = this.subscribeDataSource.concat(items);
        }
        this.paginationSubscribe.currentPage += 1;
        this.paginationSubscribe.pageTotal = res.count;

        $state && $state.loaded();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding: 15px;
  }

  :deep(.el-form-item__content) {
    margin-bottom: 0px;
  }

  .el-form-item {
    margin-bottom: 0px !important;
  }

  :deep(.el-tabs__header) {
    margin: 0 0 15px 15px;
  }
}

@media (max-width: 960px) {
  .container {
    .el-form-item.search-input,
    .el-form-item.search-button {
      display: none;
    }
  }
}
</style>
