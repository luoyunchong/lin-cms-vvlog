<template>
  <div>
    <el-card
      :body-style="{ 'padding-bottom': '10px','padding-top':'10px' }"
      shadow="never"
      style="margin-bottom:10px;border-radius: 8px;"
      class="tag-card"
      v-loading="loading"
    >
      <div slot="header" class="clearfix">
        <span class="tag-title">热门标签</span>
        <router-link :to="{path:'/tag/subscribe/all'}">
          <el-button style="float: right; padding: 0" type="text">
            查看更多
            <i class="el-icon-arrow-right el-icon--right" style="margin-left:0px;"></i>
          </el-button>
        </router-link>
      </div>
      <el-tag v-for="tag in dataSource" v-bind:key="tag.id" :hit="false" effect="light" type="info">
        <router-link :to="{path:'/tag/'+`${tag.id}`}" target="_blank">{{tag.tag_name}}</router-link>
      </el-tag>
    </el-card>
  </div>
</template>

<script>
import tagApi from "@/models/tag";
export default {
  name: "HotTagCard",
  data() {
    return {
      dataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 15,
        pageTotal: 0
      },
      loading: false
    };
  },
  async created() {
    await this.getTags();
  },
  methods: {
    async getTags() {
      this.loading = true;
      let res = await tagApi
        .getTags({
          count: this.pagination.pageSize,
          page: this.pagination.currentPage,
          sort: "article_count desc"
        })
        .finally(() => {
          this.loading = false;
        });
      this.dataSource = [...res.items];
    }
  }
};
</script>

<style  lang="scss" scoped>
.tag-title {
  margin-bottom: 1rem;
  padding: 0 0 0 0.5rem;
  color: #000;
  border-left: 4px solid #ec7259;
}
.el-tag {
  margin-bottom: 8px;
  margin-right: 12px;
  height: 26px;
  line-height: 26px;
  &:hover {
    opacity: 0.8;
  }
}
</style>