<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <tag-item
          :article_count="item.article_count"
          :id="item.id"
          :tag_name="item.tag_name"
          :thumbnail_display="item.thumbnail_display"
        ></tag-item>
      </el-col>
    </el-row>
    <article-list :dataSource="dataSource"></article-list>
    <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
      <span slot="no-more">
        <el-divider class="lin-divider">我也是有底线的...</el-divider>
      </span>
      <span slot="no-results">
        <el-divider class="lin-divider">没有文章...</el-divider>
      </span>
    </infinite-loading>
  </div>
</template>

<script>
import ArticleList from "@/views/article/ArticleList";
import TagItem from "@/views/tag/TagItem";
import InfiniteLoading from "vue-infinite-loading";
import articleApi from "@/models/article";
import tagApi from "@/models/tag";
export default {
  name: "TagDetail",
  components: { ArticleList, InfiniteLoading, TagItem },
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
      any: new Date(),
      item: {
        id: "",
        tag_name: "",
        thumbnail_display: "",
        article_count: 0
      }
    };
  },
  mounted() {
    this.get();
  },
  computed: {
    tag_id() {
      return this.$route.params.id;
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
      res = await articleApi.getAllArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        tag_id: this.tag_id
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
    async get() {
      let tag = await tagApi.getTag(this.tag_id);
      this.item = tag;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
