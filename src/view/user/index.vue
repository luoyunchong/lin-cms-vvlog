<template>
  <div>
    <el-row class="row-bg" :gutter="20">
      <el-col :xs="24" :md="17">
        <div class="margin-bottom-xs">
          <el-card class="box-card" shadow="never">
            <profile></profile>
          </el-card>
        </div>
        <div style="background: #fff; padding: 26px 24px;" class="margin-bottom-xs">
          <el-tabs v-model="tab" class="vv-tabs " @tab-click="handleTabClick">
            <el-tab-pane name="article">
              <template #label> <i class="el-icon-date"></i> <span>随笔</span> </template>
              <!-- <my-create-classify></my-create-classify> -->
              <article-list :dataSource="dataSource" class="vv-article-list"></article-list>
              <infinite-loading @infinite="infiniteHandler" :identifier="any" distance="50">
                <template #spinner>
                  <el-divider class="lin-divider">加载中...</el-divider>
                </template>
                <template #complete>
                  <el-divider class="lin-divider">我也是有底线的...</el-divider>
                </template>
              </infinite-loading>
            </el-tab-pane>
            <el-tab-pane name="subscribe">
              <template #label> <i class="el-icon-user"></i> <span>关注</span> </template>
              <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
                <el-tab-pane :label="'关注用户' + info.subscribe_count" name="subscribe">
                  <subscribe-user-list :userId="userId" userType="subscribe" v-if="activeName == 'subscribe'"
                    v-on:success="subscribe_count => info.subscribe_count = subscribe_count"
                    v-on:subscribe="subscribe_count => info.subscribe_count += subscribe_count"></subscribe-user-list>
                </el-tab-pane>
                <el-tab-pane :label="'粉丝' + info.fans_count" name="fans">
                  <subscribe-user-list :userId="userId" userType="fans" v-if="activeName == 'fans'"
                    v-on:success="fans_count => info.fans_count = fans_count"
                    v-on:subscribe="fans_count => info.subscribe_count += fans_count"></subscribe-user-list>
                </el-tab-pane>
                <el-tab-pane :label="'标签' + info.tag_count" name="tag">
                  <subscribe-tag-list :userId="userId" v-if="activeName == 'tag'"
                    v-on:success="tag_count => info.tag_count = tag_count"
                    v-on:subscribe="tag_count => info.tag_count += tag_count"></subscribe-tag-list>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane name="collection">
              <template #label> <i class="el-icon-collection"></i> <span>收藏</span> </template>
              <collection-list></collection-list>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :xs="24" :md="7">
        <div class="margin-bottom-xs">
          <el-card class="box-card" shadow="never" :body-style="{ padding: '0px' }">
            <div class="number-board">
              <router-link :to="`/user/${userId}/subscribe?key=subscribe`" class="number-board-item">
                <div class="number-board-item-inner">
                  <div class="number-board-item-name">关注用户</div>
                  <strong class="number-board-item-value">{{ info.subscribe_count }}</strong>
                </div>
              </router-link>
              <el-divider direction="vertical"></el-divider>
              <router-link :to="`/user/${userId}/subscribe?key=fans`" class="number-board-item">
                <div class="number-board-item-inner">
                  <div class="number-board-item-name">粉丝</div>
                  <strong class="number-board-item-value">{{ info.fans_count }}</strong>
                </div>
              </router-link>
            </div>
          </el-card>
        </div>
        <div class="margin-bottom-xs">
          <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never" class="tag-card">
            <template #header>
              <div class="lin-card">
                <span class="lin-title">分享你的创作</span>
              </div>
            </template>
            <div>
              <router-link :to="{ path: `/p/editor/0` }">
                <el-button type="primary" plain>
                  <el-icon class="el-icon--left">
                    <Edit />
                  </el-icon>写随笔
                </el-button>
              </router-link>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { SubscribeUserList, SubscribeTagList } from '@/view/subscribe'
import Profile from '@/view/user/profile'
import articleApi from '@/model/article'
import subscribeApi from '@/model/subscribe'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import ArticleList from '@/view/article/article-list'
import MyCreateClassify from './my-create-classify'
import CollectionList from '@/view/collection/collection-list'

export default {
  name: 'UserIndex',
  components: {
    SubscribeUserList,
    SubscribeTagList,
    Profile,
    ArticleList,
    InfiniteLoading,
    MyCreateClassify,
    CollectionList
  },
  data() {
    return {
      tab: 'article',
      activeName: 'subscribe',
      dataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0,
      },
      loading: false,
      any: new Date(),
      info: {
        subscribe_count: 0,
        fans_count: 0,
        tag_count: 0,
      },
      classifys: [],
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    name() {
      return this.$route.params.name
    },
    classify_id() {
      return this.$route.query.classify_id
    },
  },
  watch: {
    name(newVal) {
      this.tab = newVal
    },
    async $route(v) {
      let key = v.query.key
      switch (v.params.name) {
        case 'article':
          this.refresh()
          break
        case 'subscribe':
          if (key == null || key == undefined) {
            key = 'subscribe'
          }
          this.activeName = key
          await this.getUserSubscribe()
          break
        case 'collection':
          break
        default:
          break
      }
    },
  },
  async created() {
    console.log(this.query)
    // await this.getUserSubscribe()
  },
  mounted() {
    switch (this.name) {
      case 'article':
      case 'subscribe':
      case 'collection':
        this.tab = this.name
        break
      default:
        this.tab = 'article'
        break
    }
    let key = this.$route.query.key
    if (key == null || key == undefined) {
      key = 'subscribe'
    }
    this.activeName = key
  },
  methods: {
    async refresh() {
      this.pagination.currentPage = 0
      this.any = new Date()
      await this.infiniteHandler()
    },
    handleTabClick(tab, event) {
      if (tab.paneName == this.name) return
      this.$router.push({ path: `/user/${this.userId}/${tab.paneName}` })
    },
    handleClick(tab, event) {
      if (tab.paneName == this.$route.query.key) return
      this.$router.push({
        path: `/user/${this.userId}/subscribe?key=${tab.name}`,
      })
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
    async getUserSubscribe() {
      if (this.userId != null) {
        let res = await subscribeApi.getUserSubscribe({
          userId: this.userId,
        })
        this.info = res
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.lin-divider .el-divider__text {
  background-color: #f4f5f5;
}

.list {
  .item {
    cursor: pointer;
    padding-left: 10px;

    &:hover {
      background: #e6f7ff;
    }
  }
}

.vv-article-list :deep(.article-list .article-item) {
  padding: 1.5rem 0rem;
}

.vv-tabs :deep(.el-tabs__item) {
  font-size: 16px;
}

.vv-tabs :deep(.el-tabs__nav .el-tabs__active-bar) {
  height: 3px;
}

.number-board {
  display: flex;

  .el-divider--vertical {
    height: 5rem;
  }

  .number-board-item {
    flex: 1 1;

    &:hover {
      color: #175199;
    }

    .number-board-item-inner {
      padding: 12px 0;
      text-align: center;
      line-height: 1.6;

      .number-board-item-name {
        font-size: 14px;
        color: #8590a6;
      }

      .number-board-item-value {
        font-size: 20px;
        color: #1a1a1a;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.lin-card {
  margin-bottom: 10px;
  border-radius: 8px;

  .lin-title {
    margin-bottom: 1rem;
    padding: 0 0 0 0.5rem;
    color: #000;
    border-left: 4px solid #ec7259;
  }
}

.tag-card {
  margin-bottom: 10px;
  border-radius: 8px;
}

.tag-title {
  margin-bottom: 1rem;
  padding: 0 0 0 0.5rem;
  color: #000;
  border-left: 4px solid #ec7259;
}
</style>
