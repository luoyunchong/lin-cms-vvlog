<template>
  <div>
    <div v-show="!deleted">
      <el-row :gutter="20">
        <el-col>
          <tag-item
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
      <article-list :dataSource="dataSource"></article-list>
      <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
        <span slot="no-more">
          <el-divider class="lin-divider">我也是有底线的...</el-divider>
        </span>
        <span slot="no-results">
          <el-divider class="lin-divider">没有随笔...</el-divider>
        </span>
      </infinite-loading>
    </div>
    <error-404-page v-show="deleted"></error-404-page>
  </div>
</template>

<script>
import ArticleList from "@/views/article/ArticleList";
import TagItem from "@/views/tag/TagItem";
import InfiniteLoading from "vue-infinite-loading";
import articleApi from "@/models/article";
import tagApi from "@/models/tag";
import Error404Page from "@/views/error-page/404";

export default {
  name: "TagDetail",
  components: { ArticleList, InfiniteLoading, TagItem, Error404Page },
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
      },
      deleted: false
    };
  },
  async mounted() {
    await this.get();
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
      res = await articleApi.getQueryArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        tag_id: this.tag_id,
        sort: "CreateTime"
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
      try {
        this.deleted = false;
        let tag = await tagApi.getTag(this.tag_id);
        this.item = tag;
      } catch (ex) {
        this.deleted = true;
      }
    },
    addSubscribeDataTag(index) {
      this.item.is_subscribe = true;
      this.item.subscribers_count += 1;
    },
    deleteSubscribeDataTag(index) {
      this.item.is_subscribe = false;
      if (this.item.subscribers_count > 1) this.item.subscribers_count -= 1;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
