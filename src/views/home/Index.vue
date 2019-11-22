<template>
  <div>
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
  computed: {},
  methods: {
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    async infiniteHandler($state) {
      let res;
      const currentPage = this.pagination.currentPage;
      res = await articleApi.getAllArticles({
        count: this.pagination.pageSize,
        page: currentPage
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
    }
  }
};
</script>

<style scoped lang="scss">
</style>
