<template>
  <div class="container">
    <el-row :gutter="24" style="margin-left:0px;">
      <el-col :span="24">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-link :type="sort=='newest'?'primary':'info'" href="/tag?sort=newest">最新</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link :type="sort=='hottest'?'primary':'info'" href="/tag?sort=hottest">最热</el-link>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.tag_name"
              placeholder="根据标签名查询"
              clearable
              size="small"
              @clear="refresh"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refresh">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
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
import tagApi from "@/models/tag";
import InfiniteLoading from "vue-infinite-loading";
import TagItem from "@/views/tag/TagItem";
export default {
  components: { InfiniteLoading, TagItem },
  name: "TagList",
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
      form: {
        tag_name: ""
      }
    };
  },
  computed: {
    sort() {
      return this.$route.query.sort;
    }
  },
  created() {
    // this.refresh();
  },
  methods: {
    async sortBy(active) {
      this.active = active;
      this.refresh();
    },
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    async infiniteHandler($state) {
      let res;
      const currentPage = this.pagination.currentPage;
      let sort = this.sort;
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