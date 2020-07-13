<template>
  <div>
    <div class="page-header-index-wide" v-show="!deleted">
      <el-row :gutter="24">
        <el-col :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div class="info-box margin-bottom-xs">
              <h1 class="title">{{model.title}}</h1>
            </div>
            <div class="info-box margin-bottom-xs" v-loading="loading">
              <el-row type="flex">
                <el-col :span="2" :xs="4">
                  <router-link :to="{path:`/user/${model.user_info.id}/article`}" target="_blank">
                    <el-avatar size="large" :src="model.user_info.avatar" icon="el-icon-user-solid"></el-avatar>
                  </router-link>
                </el-col>
                <el-col :span="22" :xs="20">
                  <el-row :gutter="10">
                    <el-col :span="20" :xs="18">
                      <el-col :span="24">
                        <router-link
                          class="nickname"
                          :to="{path:`/user/${model.user_info.id}/article`}"
                          target="_blank"
                        >{{model.user_info.nickname}}</router-link>
                      </el-col>
                      <el-col :span="24">
                        <span>{{model.time_span}}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span>阅读 {{model.view_hits}}</span>
                        <template v-if="user!=null&&model.user_info.id==user.id">
                          <el-divider direction="vertical"></el-divider>
                          <el-link
                            type="primary"
                            :href="`#/post/editor/${model.id}`"
                            target="_blank"
                          >编辑</el-link>
                        </template>
                        <el-divider direction="vertical"></el-divider>
                        <span>
                          <el-tag type="primary" v-if="model.article_type==0">原创</el-tag>
                          <el-tag type="success" v-else-if="model.article_type==1">转载</el-tag>
                          <el-tag type="info" v-else-if="model.article_type==2">翻译</el-tag>
                        </span>
                      </el-col>
                    </el-col>
                    <el-col
                      :span="4"
                      :xs="4"
                      style="text-align:right;padding-left:0px;"
                      v-if="user!=null&&model.user_info.id!=user.id"
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
            <div id="preview" class="preview" @click="handleHtml($event)"></div>
            <div id="outline"></div>
            <!-- <MarkdownPreview v-if="model.editor==1" :initialValue="model.content" theme="dark" /> -->
            <!-- <div class="tinymce" v-else v-html="model.content"></div> -->
            <div class="tag-box top20" v-show="model.tags.length>0">
              <h3 class="tag-title">标签</h3>
              <el-tag
                :hit="false"
                effect="light"
                type="info"
                v-bind:key="item.id"
                v-for="item in model.tags"
              >
                <router-link :to="{path:'/tag/'+`${item.id}`}" target="_blank">
                  <div
                    alt="黑客派"
                    class="tag-image"
                    :style="`background-image: url('${item.thumbnail_display}');`"
                  ></div>
                  {{item.tag_name}}
                </router-link>
              </el-tag>
            </div>
          </el-card>
          <div id="comment-list">
            <comment-list
              :subject_id="id"
              :subject_type="1"
              :resp_user_id="model.create_user_id"
              v-on:success="getCommentSuccess"
            ></comment-list>
          </div>
          <el-backtop class="lin-back-top"></el-backtop>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" class="sidebar-user">
          <el-card v-show="model.user_info.id!=0" style="margin-bottom:20px;">
            <div slot="header" class="clearfix" :body-style="{ padding: '0'}">
              <span>关于作者</span>
            </div>
            <div class="info-box" style="display: flex;">
              <div style="flex: 0 0 auto;margin-right: 1rem;">
                <router-link
                  :to="{
                      path:`/user/${model.user_info.id}/article`
                 }"
                  target="_blank"
                  class="avatar"
                >
                  <el-avatar size="large" :src="model.user_info.avatar" icon="el-icon-user-solid"></el-avatar>
                </router-link>
              </div>
              <div style="flex: 1 1 auto;min-width: 0;">
                <router-link
                  class="nickname"
                  :to="{
                      path:`/user/${model.user_info.id}/article`
                 }"
                  target="_blank"
                >{{model.user_info.nickname}}</router-link>
                <div class="intro-content">{{model.user_info.introduction}}</div>
              </div>
            </div>
            <div class="info-box" style="display: flex;">
              <v-list
                itemLayout="vertical"
                :dataSource="latestArticles"
                :bordered="false"
                class="lastest-articles"
                v-loading="latestLoading"
              >
                <template v-slot:renderItem="{item}">
                  <v-list-item>
                    <li slot="actions">
                      <span style="font-size: 12px; color: #969696;">阅读 {{item.view_hits}}</span>
                    </li>
                    <v-list-item-meta>
                      <a
                        slot="description"
                        target="_blank"
                        :title="item.title"
                        :href="'/#/post/'+item.id"
                        style="color:rgb(45, 45, 45);"
                      >{{item.title}}</a>
                    </v-list-item-meta>
                  </v-list-item>
                </template>
              </v-list>
            </div>
          </el-card>

          <el-card
            class="aside-list"
            shadow="never"
            :body-style="{ padding: '12px'}"
            :style="this.aside>260?'position: fixed;top:80px;width:260px;':''"
          >
            <div slot="header" class="clearfix">
              <span>目录</span>
            </div>
            <div id="navigation" class="wx_navigation" />
          </el-card>
        </el-col>
      </el-row>
      <tools-badge
        :model="{
          id: model.id,
          is_liked:  model.is_liked,
          likes_quantity:  model.likes_quantity,
          is_comment:  model.is_comment,
          comment_quantity:  model.comment_quantity,
          is_collect:  model.is_collect,
          collect_quantity:  model.collect_quantity
    }"
        @likeChange="likeChange"
      ></tools-badge>
    </div>
    <error-404-page v-show="deleted"></error-404-page>
  </div>
</template>

<script>
import articleApi from '../../model/article';
import subscribeApi from '../../model/subscribe';
import ToolsBadge from './tools-badge';
import CommentList from '@/view/comment/comment-list';
import { SubscribeButton } from '@/view/subscribe';
import Error404Page from '@/view/error-page/404';
import Vditor from 'vditor';
import VList from '@/component/list';
import '@/component/list/index.css';
import settingApi from '@/model/setting';

export default {
  name: 'ArticleDetail',
  data() {
    return {
      model: {
        user_info: {
          id: 0
        },
        tags: [],
        content: '',
        codeTheme: 'github'
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
      latestArticles: []
    };
  },
  components: {
    ToolsBadge,
    CommentList,
    SubscribeButton,
    Error404Page,
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  async created() {
    await this.getData();

    this.activeIndex = 0;
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.dataScroll, true);
    });
  },
  watch: {
    scroll: function() {
      this.loadSroll();
    },
    $route(to, from) {
      // this.getData();
    }
  },
  methods: {
    getCommentSuccess(total) {
      this.model.comment_quantity = total;
    },
    likeChange({ likes_quantity, is_liked }) {
      this.model.likes_quantity += likes_quantity;
      this.model.is_liked = is_liked;
    },
    async getData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading'
      });
      try {
        this.deleted = false;
        this.model = await articleApi.getArticle(this.id).finally(() => {
          loading.close();
        });
        document.title = this.model.title;
        if (this.model.word_number == 0) {
          this.model.word_number = this.model.content.length;
          this.model.reading_time = Number(
            this.model.word_number / 800
          ).toFixed(0);
        }

        this.render(this.model.content);

        let codeTheme = await settingApi.getSettingByKey('Article.CodeTheme');
        if (codeTheme != '' && codeTheme != null) {
          this.model.codeTheme = codeTheme;
        }
        Vditor.setCodeTheme(this.model.codeTheme);
        if (this.model.user_info == undefined) {
          this.model.user_info = {
            id: 0
          };
        } else {
          await this.getQueryArticles();
        }
      } catch (ex) {
        console.log(ex);
        this.deleted = true;
      }
    },
    init() {
      this.$nextTick(() => {
        this.buildNavigation();
        document
          .getElementById('preview')
          .querySelectorAll('h1,h2,h3,h4,h5')
          .forEach((item, index) => {
            this.heightArr.push(item.offsetTop - 30);
          });
        this.nodes = document
          .getElementById('navigation')
          .getElementsByClassName('navigator-item');
      });
    },
    dataScroll: function() {
      try {
        this.scroll =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          document.querySelector('#preview').scrollTop;

        this.aside =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          document.querySelector('.aside-list').scrollTop;
      } catch (ex) {
        console.error(ex);
      }
    },
    loadSroll() {
      let self = this;
      for (let i = 0; i < this.heightArr.length - 1; i++) {
        if (this.nodes[i] && this.nodes[i].classList != undefined) {
          if (
            this.scroll >= this.heightArr[i] &&
            this.scroll <= this.heightArr[i + 1]
          ) {
            this.nodes[i].classList.add('active');
          } else {
            this.nodes[i].classList.remove('active');
          }
        }
      }
    },
    buildNavigation() {
      let navigation = document.getElementById('navigation');
      let articleId = this.id;
      const nodes = document
        .getElementById('preview')
        .querySelectorAll('h1,h2,h3,h4,h5');
      let newDoms = [];
      let router = this.$router;
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const id = nodes[i].id;
          let navigationChildren = judageH(nodes[i], i, id);
          navigation.appendChild(navigationChildren);
        }
      }
      function judageH(node, i, domId) {
        const reg = /^H[1-5]{1}$/;
        if (reg.exec(node.tagName)) {
          let cloneNode = node.cloneNode();

          cloneNode.classList.add('navigator-item');
          const a = document.createElement('a');

          // a.href = `/#/post/${articleId}#${domId}`;
          a.id = domId;
          a.setAttribute('articleId', articleId);
          a.innerHTML = node.innerText;
          cloneNode.appendChild(a);
          cloneNode.onclick = function() {
            let parents = cloneNode.parentElement.children;
            for (let j = 0; j < parents.length; j++) {
              parents[j].classList.remove('active');
            }
            cloneNode.classList.add('active');
            let id = this.children[0].id;
            let articleId = this.children[0].getAttribute('articleId');

            // console.log(id);
            // console.log(location.hash);
            // console.log(`#/post/${articleId}#${encodeURIComponent(id)}`);

            if (
              location.hash == `#/post/${articleId}#${encodeURIComponent(id)}`
            ) {
              return;
            }

            router.replace({ path: `/post/${articleId}#${id}` });
          };
          newDoms.push(cloneNode);

          return cloneNode;
        }
        return '';
      }
      const sliceDoms = []; // 归类好的节点树

      newDoms.forEach((dom, i) => {
        // 把标题归类 每部分的标题组合到一起
        const level = dom.tagName.substr(1);
        const upLevel = newDoms[i - 1] ? newDoms[i - 1].tagName.substr(1) : '';

        if (upLevel) {
          if (level > upLevel) {
            sliceDoms[sliceDoms.length - 1].push(dom);
          } else if (
            level > sliceDoms[sliceDoms.length - 1][0].tagName.substr(1)
          ) {
            sliceDoms[sliceDoms.length - 1].push(dom);
          } else {
            sliceDoms.push([dom]);
          }
        } else {
          sliceDoms.push([dom]);
        }
      });
      sliceDoms.forEach(doms => {
        const thisTitleMaxId = doms[0].tagName.substr(1);
        doms.forEach(dom => {
          const domHeadingLevel = dom.tagName.substr(1) - thisTitleMaxId + 1;
          dom.classList.add('heading_' + domHeadingLevel);
        });
      });
    },
    subscribe(is_subscribeed) {
      this.is_subscribeed = is_subscribeed;
    },
    render(markdown) {
      var that = this;
      Vditor.preview(document.getElementById('preview'), markdown, {
        markdown: {
          toc: true,
          theme: 'light'
          // linkBase: `#/post/${that.id}`
        },
        hljs: {
          enable: true,
          style: 'tango',
          lineNumber: true
        },
        speech: {
          enable: true
        },
        anchor: 2,
        after() {
          that.init();
          if (window.innerWidth <= 768) {
            return;
          }
        },
        lazyLoadImage:
          'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
        renderers: {
          renderHeading: (node, entering) => {
            //https://hacpai.com/article/1588412297062
            const id = Lute.GetHeadingID(node);
            if (entering) {
              return [
                `<h${node.__internal_object__.HeadingLevel} id="${id}" class="vditor__heading">
<span class="prefix"></span><span>`,
                Lute.WalkContinue
              ];
            } else {
              return [
                `</span><a id="vditorAnchor-${id}" class="vditor-anchor" href="#${id}"><svg viewBox="0 0 16 16" version="1.1" width="16" height="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a></h${node.__internal_object__.HeadingLevel}>`,
                Lute.WalkContinue
              ];
            }
          }
        }
      });
    },
    async getQueryArticles() {
      this.latestLoading = true;
      var data = await articleApi
        .getQueryArticles({
          count: 3,
          page: 0,
          user_id: this.model.user_info.id
        })
        .finally(() => {
          this.latestLoading = false;
        });
      this.latestArticles = data.items;
    },
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName == 'IMG') {
          console.log($event.target.currentSrc);
          this.$imagePreview({
            images: [$event.target.currentSrc]
          });
        }
      }
    }
  }
};
</script>

<style  lang="scss" scoped>
@import '~vditor/dist/index.css';
.page-header-index-wide {
  max-width: 1200px;
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
    font-weight: 600;
    color: #000;
    font-weight: 700;
    line-height: 1.5;
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

#preview /deep/ {
  color: #24292e;
  padding: 0px 12px 20px 12px !important;
  ul li,
  a,
  p {
    line-height: 1.6;
    font-size: 15px !important;
    font-family: '-apple-system', BlinkMacSystemFont, '\5FAE\8F6F\96C5\9ED1',
      'PingFang SC', Helvetica, Arial, 'Hiragino Sans GB', 'Microsoft YaHei',
      SimSun, '\5B8B\4F53', Heiti, '\9ED1\4F53', sans-serif;
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
  // table tr:nth-of-type(even) td {
  //   background-color: #f6f8fa;
  // }
  ul li:after {
    width: 4px;
    height: 4px;
  }

  ul li input[type='checkbox']:before {
    z-index: 199 !important;
  }

  // .markdown-theme-dark pre code,
  // .code-block p {
  //   color: #fff;
  // }
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

.sidebar-user .info-box .lastest-articles /deep/ {
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

.wx_navigation /deep/ .navigator-item,
.wx_navigation /deep/ .navigator-item-title {
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

.wx_navigation /deep/ {
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
    padding-left: 20px;
  }

  .navigator-item.heading_3 {
    padding-left: 30px;
  }

  .navigator-item.heading_4 {
    padding-left: 40px;
  }

  .navigator-item.heading_5 {
    padding-left: 50px;
  }

  .navigator-item.heading_6 {
    padding-left: 60px;
  }
}
.wx_navigation /deep/ .navigator-item {
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
.mobile {
  .el-backtop {
    bottom: 5rem !important;
  }
}
@media (max-width: 960px) {
  .aside-list {
    display: none;
  }
}
</style>