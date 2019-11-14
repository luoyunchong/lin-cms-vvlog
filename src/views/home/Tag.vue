<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="6" :xs="12" :md="6" v-for="(o) in 12" :key="o">
        <el-card
          class="info-box"
          shadow="hover"
          :body-style="{ 
                'width':' 100%',
                'background-color': '#fff',
                'border': '1px solid #f1f1f1',
                'transition': 'border-color .3s',
                'padding': '1.5rem 0'}"
        >
          <div class="width:100%;text-align:center;">
            <img
              src="https://lc-gold-cdn.xitu.io/bac28828a49181c34110.png?imageView2/2/w/200/h/64/q/85/format/webp/interlace/1"
              class="image"
              style="width: 32px;height: 32px;margin:10px auto"
            />
          </div>
          <div style="padding: 14px;text-align:center;">
            <span class="title">前端</span>
            <div class="bottom clearfix" style="margin-top:10px;">
              <div class="meta-box">
                <time class="meta subscribe">397398 关注</time>
                <time class="meta article">37335 文章</time>
              </div>
              <el-button type="primary" class="button" icon="iconfont icon-heart-fill">已关注</el-button>
              <el-button type="plain" class="button" icon="iconfont icon-heart">关注</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any"></infinite-loading> -->
  </div>
</template>

<script>
import tagApi from "@/models/tag";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: { InfiniteLoading },
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
  created() {},
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