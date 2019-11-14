<template>
  <div class="container">
    <el-row :gutter="24" style="margin-left:0px;">
      <el-col :span="6" :xs="12" :md="6" v-for="(item,index) in dataSource" :key="index">
        <tag-item
          :article_count="item.article_count"
          :id="item.id"
          :tag_name="item.tag_name"
          :thumbnail_display="item.thumbnail_display"
        ></tag-item>
      </el-col>
    </el-row>
    <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
      <span slot="no-more">没有更多标签了</span>
      <span slot="no-results">加载完成</span>
    </infinite-loading>
  </div>
</template>

<script>
import tagApi from "@/models/tag";
import InfiniteLoading from "vue-infinite-loading";
import TagItem from "@/views/tag/TagItem";
export default {
  components: { InfiniteLoading, TagItem },
  name: "Tag",
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
      model: {
        alias: "",
        create_time: 1573521607710,
        create_user_id: 7,
        id: "5dca7947-3e28-1460-0026-4835799a9601",
        tag_name: "测试",
        thumbnail: "2019/11/12/82f53f1c-8ffe-4f8f-ab6d-6002a54cea5a.jpg",
        thumbnail_display:
          "https://localhost:5001/assets/2019/11/12/82f53f1c-8ffe-4f8f-ab6d-6002a54cea5a.jpg"
      }
    };
  },
  created() {
    // this.refresh();
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
      res = await tagApi.getTags({
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

<style lang="scss" scoped>
.container {
  margin-bottom: 20px;
}
.info-box {
  margin-bottom: 20px;
  .title {
    font-size: 1.2rem;
    line-height: 1.7rem;
    color: #333;
  }
}
.meta-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #909090;
  .meta {
    line-height: 2rem;
  }
  .article {
    margin-left: 0.8rem;
  }
}
</style>