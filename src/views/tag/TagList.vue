<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="全部标签" name="all">
        <el-row :gutter="24" style="margin-left:0px;margin-right:0px;">
          <el-col :span="24">
            <el-card shadow="never" style="margin-bottom:10px;border-radius: 8px;">
              <el-form :inline="true" size="small" :model="form" class="demo-form-inline">
                <el-form-item>
                  <router-link
                    :to="{path:'/tag/subscribe/all?sort=hottest'}"
                    :class="sortName=='hottest'?'el-link el-link--primary is-underline':'el-link el-link--info'"
                  >最热</router-link>
                  <el-divider direction="vertical"></el-divider>
                  <router-link
                    :to="{path:'/tag/subscribe/all?sort=newest'}"
                    :class="sortName=='newest'?'el-link el-link--primary is-underline':'el-link el-link--info'"
                  >最新</router-link>
                  <!-- <el-link :type="sort=='newest'?'primary':'info'" href="/tag?sort=newest">最新</el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :type="sort=='hottest'?'primary':'info'" href="/tag?sort=hottest">最热</el-link>-->
                </el-form-item>
                <el-form-item class="search-input">
                  <el-input
                    v-model="form.tag_name"
                    placeholder="根据标签名查询"
                    clearable
                    size="small"
                    @clear="refresh"
                  ></el-input>
                </el-form-item>
                <el-form-item class="search-button">
                  <el-button type="primary" @click="refresh">查询</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="6" :xs="12" :md="6" v-for="(item,index) in dataSource" :key="index">
            <tag-item
              :index="index"
              :subscribers_count="item.subscribers_count"
              :article_count="item.article_count"
              :id="item.id"
              :tag_name="item.tag_name"
              :thumbnail_display="item.thumbnail_display"
              :view_hits="item.view_hits"
              :is_subscribe="item.is_subscribe"
              v-on:addSubscribeTag="addSubscribeTag"
              v-on:deleteSubscribeTag="deleteSubscribeTag"
            ></tag-item>
          </el-col>
        </el-row>
        <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
          <span slot="no-more">
            <el-divider class="lin-divider">我也是有底线的...</el-divider>
          </span>
          <span slot="no-results">
            <el-divider class="lin-divider">没有查询您想要的标签...</el-divider>
          </span>
        </infinite-loading>
      </el-tab-pane>
      <el-tab-pane label="已关注标签" name="subscribe" v-if="logined">
        <el-row :gutter="24" style="margin-left:0px;margin-right:0px;">
          <el-col
            :span="6"
            :xs="12"
            :md="6"
            v-for="(item,index) in subscribeDataSource"
            :key="index"
          >
            <tag-item
              :index="index"
              :subscribers_count="item.subscribers_count"
              :article_count="item.article_count"
              :id="item.id"
              :tag_name="item.tag_name"
              :thumbnail_display="item.thumbnail_display"
              :is_subscribe="item.is_subscribe"
              v-on:addSubscribeTag="addSubscribeDataTag"
              v-on:deleteSubscribeTag="deleteSubscribeDataTag"
            ></tag-item>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tagApi from "@/models/tag";
import userTagApi from "@/models/userTag";
import InfiniteLoading from "vue-infinite-loading";
import TagItem from "@/views/tag/TagItem";
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
      loading: false,
      any: new Date(),
      form: {
        tag_name: ""
      },
      activeName: "subscribe",
      sortName: "hottest"
    };
  },
  computed: {
    sort() {
      return this.$route.query.sort;
    },
    tab() {
      return this.$route.params.tab;
    },
    logined() {
      return this.$store.state.logined;
    }
  },
  watch: {
    sort() {
      this.sortName = this.sort;
      this.refresh();
    }
  },
  created() {
    this.getSubscribeTags();
    // this.refresh();

    if (this.logined != true) {
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
      if (tab.name == "subscribe") {
        this.getSubscribeTags();
      } else {
        this.refresh();
      }
    },
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
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
          this.pagination.pageTotal = res.total;
        }
      } else {
        if (currentPage == 0) {
          this.dataSource = items;
        } else {
          this.dataSource = this.dataSource.concat(items);
        }
        this.pagination.currentPage += 1;
        this.pagination.pageTotal = res.total;

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
    async getSubscribeTags() {
      let userId = 0;
      if (this.user && this.user.id) {
        userId = this.user.id;
      }
      var res = await userTagApi.getSubscribeTags({
        user_id: userId,
        count: 1000
      });
      this.subscribeDataSource = [...res.items];
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 20px;
  /deep/.el-card__body {
    padding: 15px;
  }
  /deep/ .el-form-item__content {
    margin-bottom: 0px;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
  /deep/ .el-tabs__header {
    margin: 0 0 15px 15px;
  }
}

.mobile .container {
  .el-form-item.search-input,
  .el-form-item.search-button {
    display: none;
  }
}
</style>