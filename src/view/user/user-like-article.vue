<template>
  <article-list :dataSource="dataSource" class="vv-article-list" :showEdit="false"></article-list>
  <infinite-loading @infinite="infiniteHandler" :identifier="any" distance="50">
    <template #spinner>
      <el-divider class="lin-divider">加载中...</el-divider>
    </template>
    <template #complete>
      <el-divider class="lin-divider">我也是有底线的...</el-divider>
    </template>
  </infinite-loading>
</template>

<script>
import ArticleList from '@/view/article/article-list'
import articleApi from '@/model/article'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
export default {
  components: {
    ArticleList,
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
    classify_id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0,
      },
      dataSource: [],
      loading: false,
      sort: '',
      any: new Date(),
    }
  },
  async created() {
    await this.refresh()
  },
  async activated() {
    await this.refresh()
  },
  methods: {
    async refresh() {
      this.pagination.currentPage = 0
      this.any = new Date()
      console.log('user-like-article')
      await this.infiniteHandler()
    },
    async infiniteHandler($state) {
      let res
      const currentPage = this.pagination.currentPage
      res = await articleApi.getQueryArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        sort: this.sort,
        user_id: this.userId,
        classify_id: this.classify_id,
        article_search_type: 'like',
      })
      let items = [...res.items]

      if (items.length == 0) {
        if (currentPage == 0) {
          this.dataSource = items
        }
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
  },
}
</script>

<style lang="scss" scoped></style>
