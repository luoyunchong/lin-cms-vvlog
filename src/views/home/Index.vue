<template>
  <div>
    <el-card
      :body-style="{ 'padding-bottom': '0px' }"
      shadow="never"
      style="margin-bottom:10px;border-radius: 8px;"
    >
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" size="mini" label-width="80px">
            <el-form-item>
              <el-link :type="sort=='CreateTime'?'primary':'info'" href="/index?sort=CreateTime">最新</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link :type="hotType" href="/index?sort=THREE_DAYS_HOTTEST">热榜</el-link>
            </el-form-item>
            <el-form-item v-show="sort!='CreateTime'">
              <el-select :value="sort" size="mini" @change="onChange" style="width:100px;">
                <el-option label="3天内" value="THREE_DAYS_HOTTEST"></el-option>
                <el-option label="7天内" value="WEEKLY_HOTTEST"></el-option>
                <el-option label="30天内" value="MONTHLY_HOTTEST"></el-option>
                <el-option label="全部" value="HOTTEST"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <article-list :dataSource="dataSource"></article-list>
    <el-backtop></el-backtop>

    <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
      <span slot="no-more">
        <el-divider class="lin-divider">我也是有底线的...</el-divider>
      </span>
      <span slot="no-results">
        <el-divider class="lin-divider">没有查询您想要的标签...</el-divider>
      </span>
    </infinite-loading>
  </div>
</template>

<script>
import ArticleList from "@/views/article/ArticleList";
import InfiniteLoading from "vue-infinite-loading";
import articleApi from "@/models/article";
export default {
  name: "HomeIndex",
  components: { ArticleList, InfiniteLoading },
  data() {
    return {
      count: 20,
      dataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0
      },
      loading: false,
      any: new Date()
    };
  },
  mounted() {},
  computed: {
    sort() {
      return this.$route.query.sort;
    },
    hotType() {
      var sortArray = [
        "THREE_DAYS_HOTTEST",
        "WEEKLY_HOTTEST",
        "MONTHLY_HOTTEST",
        "HOTTEST"
      ];
      var that = this;
      var hot = sortArray.filter(r => {
        return r == this.$route.query.sort;
      });

      if (hot.length > 0) {
        return "primary";
      } else {
        return "info";
      }
    }
  },
  watch: {
    $route(v) {
      console.log(v);
      this.refresh();
    }
  },
  methods: {
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    async infiniteHandler($state) {
      let res;
      const currentPage = this.pagination.currentPage;
      res = await articleApi.getQueryArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        sort: this.sort
      });
      let items = [...res.items];

      if (items.length == 0) {
        $state && $state.complete();
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
    onChange(val) {
      this.$router.push("/index?sort=" + val);
    }
  }
};
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
