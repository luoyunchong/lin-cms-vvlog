<template>
  <div>
    <div v-show="!deleted">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col>
          <el-card class="info-box" shadow="hover" :body-style="{
            'background-color': '#fff',
            'border': '1px solid #f1f1f1',
            'transition': 'border-color .3s',
          }">
            <template #header>
              <div class="card-header">
                <span>{{ item.name }}</span>
                <div>
                  <el-button class="button" v-show="showCreateCollection" text @click="updateCollection(item.id)">编辑</el-button>
                  <el-button class="button" v-show="showCreateCollection" text @click="deleteCollection(item.id)">删除</el-button>
                </div>
              </div>
            </template>
            <div>
              <p class="item_remark">{{ item.remark }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <article-list :dataSource="dataSource"></article-list>
      <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any" distance="50">
        <template #spinner>
          <el-divider class="lin-divider">加载中...</el-divider>
        </template>
        <template #complete>
          <el-divider class="lin-divider">我也是有底线的...</el-divider>
        </template>
      </infinite-loading>
    </div>
    <error-404-page v-show="deleted"></error-404-page>
    <collection-form ref="createCollection" v-on:success="() => onCreateCollectionSuccess()"></collection-form>
  </div>
</template>

<script>
import ArticleList from '@/view/article/article-list'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import articleApi from '@/model/article'
import collectionApi from '@/model/collection'
import Error404Page from '@/view/error-page/404'
import CollectionForm from '@/view/collection/collection-form'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'CollectionDetail',
  components: { ArticleList, InfiniteLoading, Error404Page, CollectionForm },
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
      item: {
        id: '',
        tag_name: '',
        thumbnail_display: '',
        article_count: 0,
      },
      deleted: false,
    }
  },
  async mounted() {
    await this.get()
  },
  computed: {
    collection_id() {
      return this.$route.params.id
    },
    showCreateCollection() {
      return this.item.create_user_id == this.user?.id;
    },
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    createCollection() {
      this.$refs['createCollection'].show()
    },
    updateCollection(id) {
      this.$refs['createCollection'].show(id)
    },
    deleteCollection(id) {
      ElMessageBox.confirm('此操作将永久删除该收藏集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collectionApi.deleteCollection(id).then(() => {
          this.$message.success('删除成功')
          this.getData()
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    async refresh() {
      this.pagination.currentPage = 0
      this.any = new Date()
      await this.infiniteHandler()
    },
    async infiniteHandler($state) {
      let res
      const currentPage = this.pagination.currentPage
      res = await articleApi.getQueryArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        collection_id: this.collection_id,
        sort: 'CreateTime',
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
    async get() {
      try {
        this.deleted = false
        let collection = await collectionApi.getCollection(this.collection_id)
        this.item = collection
      } catch (ex) {
        this.deleted = true
      }
    },
    async onCreateCollectionSuccess() {
      await this.get()
    }
  },
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item_remark {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
</style>
