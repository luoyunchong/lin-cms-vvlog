<template>
  <div class="container">
    <article-list :dataSource="dataSource"></article-list>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
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
      loading: false
    };
  },
  mounted() {},
  computed: {},
  methods: {
    async infiniteHandler($state) {
      let res;
      const currentPage = this.pagination.currentPage;
      res = await articleApi.getAllArticles({
        count: this.pagination.pageSize,
        page: currentPage
      });
      let items = [...res.items];

      if (items.length == 0) {
        $state.complete();
      } else {
        this.dataSource = this.dataSource.concat(items);
        this.pagination.currentPage += 1;
        this.pagination.pageTotal = res.total;

        $state.loaded();
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
