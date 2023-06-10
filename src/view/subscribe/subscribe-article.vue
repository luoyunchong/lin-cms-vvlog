<template>
  <div>
    <el-row :gutter="24">
      <el-col>
        <div>
          <article-list :dataSource="dataSource"></article-list>
        </div>
        <el-backtop></el-backtop>
        <infinite-loading @infinite="infiniteHandler" :identifier="any" distance="50">
          <template #spinner>
            <el-divider class="lin-divider">加载中...</el-divider>
          </template>
          <template #complete>
            <el-divider class="lin-divider">我也是有底线的...</el-divider>
          </template>
        </infinite-loading>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ArticleList from '@/view/article/article-list'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import articleApi from '@/model/article'
import { SubscribeUserList } from '@/view/subscribe'

export default {
  name: 'HomeIndex',
  components: { ArticleList, InfiniteLoading, SubscribeUserList },
  data() {
    return {
      count: 20,
      dataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0,
      },
      loading: false,
      any: new Date(),
    }
  },
  mounted() {},
  computed: {},
  watch: {
    $route(v) {
      console.log(v)
      this.refresh()
    },
  },
  methods: {
    async refresh() {
      this.pagination.currentPage = 0
      this.any = new Date()
      await this.infiniteHandler()
    },
    async infiniteHandler($state) {
      let res
      const currentPage = this.pagination.currentPage
      res = await articleApi.getSubscribeArticles({
        count: this.pagination.pageSize,
        page: currentPage,
      })
      let items = [...res.items]

      if (items.length == 0) {
        $state && $state.complete()
      } else {
        if (currentPage == 0) {
          this.dataSource = items
        } else {
          this.dataSource = this.dataSource.concat(items)
        }
        this.pagination.currentPage += 1
        this.pagination.pageTotal = res.count

        $state && $state.loaded()
      }
    },
    onChange(val) {
      this.$router.push('/index?sort=' + val)
    },
  },
}
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
