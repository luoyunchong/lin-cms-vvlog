<template>
  <div>
    <div class="page-header-index-wide" v-show="!deleted">
      <el-row :gutter="24">
        <el-col :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div class="info-box margin-bottom-xs">
              <h1 class="title">{{ model.title }}</h1>
            </div>
            <div class="info-box margin-bottom-xs" v-loading="loading">
              <el-row type="flex">
                <el-col :span="2" :xs="4">
                  <router-link :to="{ path: `/user/${model.user_info.id}/article` }" target="_blank">
                    <el-avatar size="large" :src="model.user_info.avatar" icon="el-icon-user-solid"></el-avatar>
                  </router-link>
                </el-col>
                <el-col :span="22" :xs="20">
                  <el-row :gutter="10">
                    <el-col :span="20" :xs="18">
                      <el-col :span="24">
                        <router-link
                          class="nickname"
                          :to="{ path: `/user/${model.user_info.id}/article` }"
                          target="_blank"
                          >{{ model.user_info.nickname }}</router-link
                        >
                      </el-col>
                      <el-col :span="24">
                        <span>{{ model.time_span }}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span>阅读 {{ model.view_hits }}</span>
                        <template v-if="user != null && model.user_info.id == user.id">
                          <el-divider direction="vertical"></el-divider>
                          <el-link type="primary" :href="`#/p/editor/${model.id}`" target="_blank">编辑</el-link>
                          <el-divider direction="vertical"></el-divider>
                          <el-popover :visible="visibleDelete" placement="top" :width="160">
                            <p>确认删除此随笔吗?</p>
                            <div style="text-align: right; margin: 0">
                              <el-button size="small" text @click="visibleDelete = false">取消</el-button>
                              <el-button size="small" type="primary" @click="deleteArticle()">确认</el-button>
                            </div>
                            <template #reference>
                              <el-link type="primary" @click="visibleDelete = true" target="_blank">删除</el-link>
                            </template>
                          </el-popover>
                        </template>
                        <el-divider direction="vertical"></el-divider>
                        <span>
                          <el-tag v-if="model.article_type == 0">原创</el-tag>
                          <el-tag type="success" v-else-if="model.article_type == 1">转载</el-tag>
                          <el-tag type="info" v-else-if="model.article_type == 2">翻译</el-tag>
                        </span>
                      </el-col>
                    </el-col>
                    <el-col
                      :span="4"
                      :xs="4"
                      style="text-align: right; padding-left: 0px"
                      v-if="user != null && model.user_info.id != user.id"
                    >
                      <subscribe-button
                        v-if="model.user_info.id"
                        :userId="model.user_info.id"
                        @subscribe="subscribe"
                        :is_subscribeed="is_subscribeed"
                      ></subscribe-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="info-box margin-bottom-xs">
              <el-alert
                :title="`本文共${model.word_number}字,阅读约需${model.reading_time}分钟。`"
                type="info"
              ></el-alert>
            </div>
            <div id="preview" class="preview" @click="handlePreview($event)"></div>
            <div id="outline"></div>
            <div class="tag-box top20" v-show="model.tags.length > 0">
              <h3 class="tag-title">标签</h3>
              <el-tag :hit="false" effect="light" type="info" v-bind:key="item.id" v-for="item in model.tags">
                <router-link :to="{ path: '/tag/' + `${item.id}` }" target="_blank">
                  <div
                    alt="天上有木月"
                    class="tag-image"
                    :style="`background-image: url('${item.thumbnail_display}');`"
                  ></div>
                  {{ item.tag_name }}
                </router-link>
              </el-tag>
            </div>
          </el-card>
          <div id="comment-list" class="margin-bottom-xs">
            <comment-list
              :subject_id="id"
              :subject_type="1"
              v-if="user != null"
              :resp_user_id="model.create_user_id"
              :commentable="model.commentable"
              :authorid="model.user_info.id"
              v-on:success="getCommentSuccess"
              v-on:updateCommentable="updateCommentable"
            ></comment-list>
          </div>
          <el-backtop class="lin-back-top"></el-backtop>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" class="sidebar-user">
          <el-card v-show="model.user_info.id != 0" style="margin-bottom: 20px">
            <template #header>
              <div class="card-header" :body-style="{ padding: '0' }">
                <span>关于作者</span>
              </div>
            </template>
            <div class="info-box" style="display: flex">
              <div style="flex: 0 0 auto; margin-right: 1rem">
                <router-link
                  :to="{
                    path: `/user/${model.user_info.id}/article`,
                  }"
                  target="_blank"
                  class="avatar"
                >
                  <el-avatar size="large" :src="model.user_info.avatar" icon="el-icon-user-solid"></el-avatar>
                </router-link>
              </div>
              <div style="flex: 1 1 auto; min-width: 0">
                <router-link
                  class="nickname"
                  :to="{
                    path: `/user/${model.user_info.id}/article`,
                  }"
                  target="_blank"
                  >{{ model.user_info.nickname }}</router-link
                >
                <div class="intro-content">{{ model.user_info.introduction }}</div>
              </div>
            </div>
            <div class="info-box" style="display: flex">
              <v-list
                itemLayout="vertical"
                :dataSource="latestArticles"
                :bordered="false"
                class="lastest-articles"
                v-loading="latestLoading"
              >
                <template v-slot:renderItem="{ item }">
                  <v-list-item>
                    <template #actions>
                      <li>
                        <span style="font-size: 12px; color: #969696">阅读 {{ item.view_hits }}</span>
                      </li>
                    </template>

                    <v-list-item-meta>
                      <template #description>
                        <a
                          target="_blank"
                          :title="item.title"
                          :href="'/#/p/' + item.id"
                          style="color: rgb(45, 45, 45)"
                          >{{ item.title }}</a
                        ></template
                      >
                    </v-list-item-meta>
                  </v-list-item>
                </template>
              </v-list>
            </div>
          </el-card>

          <el-card
            class="aside-list"
            shadow="never"
            :body-style="{ padding: '12px' }"
            :style="this.aside > 260 ? 'position: fixed;top:80px;width:260px;' : ''"
          >
            <template #header>
              <div class="card-header">
                <span>目录</span>
              </div>
            </template>
            <div id="navigation" class="wx_navigation" />
          </el-card>
        </el-col>
      </el-row>
      <tools-badge
        :model="{
          id: model.id,
          is_liked: model.is_liked,
          likes_quantity: model.likes_quantity,
          is_comment: model.is_comment,
          comment_quantity: model.comment_quantity,
          is_collect: model.is_collect,
          collect_quantity: model.collect_quantity,
        }"
        @likeChange="likeChange"
        @collectChange="collectChange"
      ></tools-badge>
      <article-collection
        ref="articleCollection"
        @success="
          () => {
            this.model.is_collect = true
            this.model.collect_quantity += 1
          }
        "
      ></article-collection>
    </div>
    <error-404-page v-show="deleted"></error-404-page>
  </div>
</template>

<script>
import articleApi from '../../model/article'
import ToolsBadge from './tools-badge'
import CommentList from '@/view/comment/comment-list'
import { SubscribeButton } from '@/view/subscribe'
import Error404Page from '@/view/error-page/404'
import Vditor from 'vditor'
import VList from '@/component/list'
import '@/component/list/index.css'
import settingApi from '@/model/setting'
import PreviewImage from '@/lin/plugin/preview'
import ArticleCollection from '@/view/collection/article-collection'
export default {
  name: 'ArticleDetail',
  data() {
    return {
      model: {
        user_info: {
          id: 0,
        },
        tags: [],
        content: '',
        codeTheme: 'github',
        commentable: true,
      },
      subscribeLoading: false,
      scroll: 0,
      aside: 0,
      currentIndex: 0,
      heightArr: [],
      nodes: [],
      avatarUrl: '',
      loading: false,
      latestLoading: false,
      deleted: false,
      is_subscribeed: null,
      latestArticles: [],
      visibleDelete: false,
    }
  },
  components: {
    ArticleCollection,
    ToolsBadge,
    CommentList,
    SubscribeButton,
    Error404Page,
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    user() {
      return this.$store.state.user
    },
  },
  async created() {
    await this.getData()
    this.activeIndex = 0
    window.addEventListener('scroll', this.dataScroll, true)
  },
  watch: {
    scroll: function () {
      this.loadSroll()
    },
  },
  methods: {
    getCommentSuccess(total) {
      this.model.comment_quantity = total
    },
    likeChange({ likes_quantity, is_liked }) {
      this.model.likes_quantity += likes_quantity
      this.model.is_liked = is_liked
    },
    collectChange({ is_collect }) {
      if (is_collect == true) {
        this.$refs['articleCollection'].show(this.model.id)
        return
      }
      this.model.is_collect = is_collect
      this.model.collect_quantity -= 1
    },
    async getData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
      })
      try {
        this.deleted = false
        this.model = await articleApi.getArticle(this.id).finally(() => {
          loading.close()
        })
        document.title = this.model.title
        if (this.model.word_number == 0) {
          this.model.word_number = this.model.content.length
          this.model.reading_time = Number(this.model.word_number / 500).toFixed(0)

          if (this.model.reading_time == 0) {
            this.model.reading_time = 1
          }
        } else if (this.model.reading_time == 0) {
          this.model.reading_time = 1
        }

        this.render(this.model.content)
        let setting = await settingApi.getSettingByKeys({
          keys: ['Article.CodeTheme', 'Article.Commentable'],
        })
        if (setting['Article.CodeTheme'] != undefined) {
          this.model.codeTheme = setting['Article.CodeTheme']
          Vditor.setCodeTheme(this.model.codeTheme)
        }
        if (setting['Article.Commentable'] != undefined) {
          this.model.commentable = Boolean(setting['Article.Commentable'])
        }
        if (this.model.user_info == undefined) {
          this.model.user_info = {
            id: 0,
          }
        } else {
          await this.getQueryArticles()
        }
      } catch (ex) {
        this.deleted = true
      }
    },
    init() {
      this.$nextTick(() => {
        this.buildNavigation()
        document
          .getElementById('preview')
          .querySelectorAll('h1,h2,h3,h4,h5')
          .forEach((item, index) => {
            this.heightArr.push(item.offsetTop - 30)
          })
        this.nodes = document.getElementById('navigation').getElementsByClassName('navigator-item')
      })
    },
    dataScroll: function () {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop || document.querySelector('#preview').scrollTop
      this.aside =
        document.documentElement.scrollTop || document.body.scrollTop || document.querySelector('.aside-list').scrollTop
    },
    loadSroll() {
      let self = this
      for (let i = 0; i < this.heightArr.length - 1; i++) {
        if (this.nodes[i] && this.nodes[i].classList != undefined) {
          if (this.scroll >= this.heightArr[i] && this.scroll <= this.heightArr[i + 1]) {
            this.nodes[i].classList.add('active')
          } else {
            this.nodes[i].classList.remove('active')
          }
        }
      }
    },
    buildNavigation() {
      let navigation = document.getElementById('navigation')
      let articleId = this.id
      const nodes = document.getElementById('preview').querySelectorAll('h1,h2,h3,h4,h5')
      let newDoms = []
      let router = this.$router
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const id = nodes[i].id
          let navigationChildren = judageH(nodes[i], i, id)
          navigation.appendChild(navigationChildren)
        }
      }
      function judageH(node, i, domId) {
        const reg = /^H[1-5]{1}$/
        if (reg.exec(node.tagName)) {
          let cloneNode = node.cloneNode()

          cloneNode.classList.add('navigator-item')
          const a = document.createElement('a')

          a.id = domId
          a.setAttribute('articleId', articleId)
          a.innerHTML = node.innerText
          cloneNode.appendChild(a)
          cloneNode.onclick = function () {
            let parents = cloneNode.parentElement.children
            for (let j = 0; j < parents.length; j++) {
              parents[j].classList.remove('active')
            }
            cloneNode.classList.add('active')
            let id = this.children[0].id
            let articleId = this.children[0].getAttribute('articleId')

            if (location.hash == `#/p/${articleId}#${encodeURIComponent(id)}`) {
              return
            }

            // router.replace({ path: `/p/${articleId}#${id}` })
            router.push({ hash: `#${id}`, replace: true })
          }
          newDoms.push(cloneNode)

          return cloneNode
        }
        return ''
      }
      const sliceDoms = [] // 归类好的节点树

      newDoms.forEach((dom, i) => {
        // 把标题归类 每部分的标题组合到一起
        const level = dom.tagName.substr(1)
        const upLevel = newDoms[i - 1] ? newDoms[i - 1].tagName.substr(1) : ''

        if (upLevel) {
          if (level > upLevel) {
            sliceDoms[sliceDoms.length - 1].push(dom)
          } else if (level > sliceDoms[sliceDoms.length - 1][0].tagName.substr(1)) {
            sliceDoms[sliceDoms.length - 1].push(dom)
          } else {
            sliceDoms.push([dom])
          }
        } else {
          sliceDoms.push([dom])
        }
      })
      sliceDoms.forEach(doms => {
        const thisTitleMaxId = doms[0].tagName.substr(1)
        doms.forEach(dom => {
          const domHeadingLevel = dom.tagName.substr(1) - thisTitleMaxId + 1
          dom.classList.add('heading_' + domHeadingLevel)
        })
      })
    },
    subscribe(is_subscribeed) {
      this.is_subscribeed = is_subscribeed
    },
    render(markdown) {
      var that = this
      Vditor.preview(document.getElementById('preview'), markdown, {
        markdown: {
          toc: true,
          theme: 'light',
        },
        hljs: {
          enable: true,
          style: 'tango',
          lineNumber: true,
        },
        speech: {
          enable: true,
        },
        anchor: 2,
        after() {
          that.init()
          if (window.innerWidth <= 768) {
            return
          }
        },
        cdn: 'http://124.221.134.143/vditor',
        lazyLoadImage: 'http://124.221.134.143/vditor/dist/images/img-loading.svg',
      })
      Vditor.mediaRender()
    },
    async getQueryArticles() {
      this.latestLoading = true
      var data = await articleApi
        .getQueryArticles({
          count: 3,
          page: 0,
          user_id: this.model.user_info.id,
        })
        .finally(() => {
          this.latestLoading = false
        })
      this.latestArticles = data.items
    },
    handlePreview($event) {
      if ($event.target) {
        if ($event.target.nodeName == 'IMG') {
          PreviewImage({
            images: [$event.target.currentSrc],
          })
        }
      }
    },
    async updateCommentable(commentable) {
      await articleApi.updateCommentable(this.id, commentable)
      this.model.commentable = commentable
    },
    async deleteArticle() {
      await articleApi.deleteArticle(this.id)
      this.visibleDelete = false
      this.$router.push('/user/' + this.model.user_info.id + '/article')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~vditor/dist/index.css';

.page-header-index-wide {
  margin: 0 auto;
}

.top20 {
  margin-top: 20px;
  padding-bottom: 20px;
}

.info-box {
  font-size: 14px;
  color: #909090;

  .title {
    font-size: 2rem;
    color: var(--el-color-black);
    font-weight: 700;
    line-height: 1.31;
  }

  .avatar {
    &:hover {
      cursor: pointer !important;
    }
  }

  .nickname {
    max-width: 100%;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 18px;
    color: #444;
    display: inline-block;
    margin-bottom: 8px;
  }
}

.tag-box {
  font-size: 14px;
  color: #909090;
  margin-bottom: 10px;

  .tag-image {
    border-radius: 2px 2px 2px 2px;
    height: 16px;
    width: 16px;
    float: left;
    margin: 2px 3px 0 0;
    background-color: rgba(0, 0, 0, 0.02);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  .tag-title {
    margin-bottom: 1rem;
    padding: 0 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #000;
    border-left: 6px solid #ddd;
  }

  .el-tag {
    margin-right: 10px;

    &:hover {
      opacity: 0.8;
    }
  }
}

#preview :deep {
  color: #24292e;
  padding: 0px 12px 20px 12px !important;

  ul li,
  a,
  p {
    line-height: 1.6;
    font-size: 15px !important;
  }

  img {
    max-width: 100%;
    width: auto !important;
    height: auto !important;

    &:hover {
      cursor: zoom-in;
    }
  }

  .code-pre {
    color: #333;
    border-radius: 2px;

    .hljs-keyword {
      color: #00f;
    }

    .hljs-title,
    .hljs-params,
    .hljs-function {
      color: #333;
    }

    .hljs-number {
      color: #361da3;
    }

    .hljs-meta {
      color: #2b91af;
    }

    .hljs-string {
      color: #a31515;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #333;
    line-height: 1.25;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-bottom: 5px;
  }

  strong {
    font-weight: 600;
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  table,
  pre {
    margin-top: 0;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 30px;
    margin-bottom: 5px;
  }

  h2 {
    margin-top: 20px;
    border-bottom: 1px solid #eaecef;
  }

  h3 {
    margin-top: 10px;
  }

  h4,
  h5,
  h6 {
    margin-top: 5px;
  }

  ul li:after {
    width: 4px;
    height: 4px;
  }

  ul li input[type='checkbox']:before {
    z-index: 199 !important;
  }

  blockquote p {
    margin-bottom: 0px;
  }

  a {
    color: #4285f4;

    &:hover {
      text-decoration: underline;
    }
  }

  .preview-img .close {
    right: 22px;
  }
}

.sidebar-user .info-box .lastest-articles :deep {
  width: 100%;

  a:hover {
    text-decoration: underline;
  }
}

@media (max-width: 600px) {
  .box-card .el-card__body {
    padding: 0px;
    padding-top: 20px;
  }

  .el-row {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }

  .el-col-xs-24 {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}

.aside-list {
  transition: all 0.2s;
}

.intro-content {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 18px;
}

.wx_navigation {
  position: relative;
  max-height: 700px;
  overflow: auto;
}

.wx_navigation :deep(.navigator-item),
.wx_navigation :deep(.navigator-item-title) {
  cursor: pointer;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  color: #333;
  white-space: nowrap;
  padding: 4px 0 4px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  position: relative;
}

.wx_navigation :deep {
  .navigator-item > a {
    // padding-left: 10px;
    position: relative;
    padding: 4px 0 4px 12px;
    white-space: nowrap;
  }

  .navigator-item.heading_1 > a {
    font-weight: 600;
    color: #000;
  }

  .navigator-item.heading_2 {
    padding-left: 10px;
  }

  .navigator-item.heading_3 {
    padding-left: 20px;
  }

  .navigator-item.heading_4 {
    padding-left: 30px;
  }

  .navigator-item.heading_5 {
    padding-left: 40px;
  }

  .navigator-item.heading_6 {
    padding-left: 60px;
  }
}

.wx_navigation :deep(.navigator-item) {
  border-left: 4px solid transparent;

  &.active {
    color: #007fff;
    border-left: 4px solid #1bc3fb;
    background: rgba(27, 195, 251, 0.1);
  }

  &:hover {
    border-left: 4px solid #1bc3fb;
    background: rgba(27, 195, 251, 0.1);
  }
}

.wx_navigation > .navigator-item > a::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -2px;
  width: 4px;
  height: 4px;
  background-color: currentColor;
  border-radius: 50%;
}

.wx_navigation > .navigator-item.heading_1 > a::before {
  margin-top: -3px;
  width: 6px;
  height: 6px;
}

@media (max-width: 960px) {
  .sidebar-user {
    margin-bottom: 40px;
  }

  .el-backtop {
    bottom: 5rem !important;
  }

  .aside-list {
    display: none;
  }
}
</style>
