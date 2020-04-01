<template>
  <div>
    <div class="page-header-index-wide" v-show="!deleted">
      <el-row :gutter="24">
        <el-col :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div class="info-box margin-bottom-xs" v-loading="loading">
              <el-row type="flex">
                <el-col :span="2">
                  <router-link :to="{path:`/user/${model.user_info.id}/article`}" target="_blank">
                    <el-avatar size="large" :src="model.user_info.avatar" icon="el-icon-user-solid"></el-avatar>
                  </router-link>
                </el-col>
                <el-col>
                  <el-row :gutter="10">
                    <el-col :span="18" :xs="18">
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
                          <el-tag type="success" v-if="model.article_type==0">原创</el-tag>
                          <el-tag type="info" v-else-if="model.article_type==1">转载</el-tag>
                          <el-tag type="danger" v-else-if="model.article_type==2">翻译</el-tag>
                        </span>
                      </el-col>
                    </el-col>
                    <el-col
                      :span="5"
                      :xs="5"
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
              <h1 class="title">{{model.title}}</h1>
            </div>
            <div class="info-box">
              <el-alert
                :title="`本文共${model.word_number}字,阅读约需${model.reading_time}分钟。`"
                type="info"
              ></el-alert>
            </div>
            <div id="preview">
              <MarkdownPreview :initialValue="model.content" theme="dark" />
            </div>
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
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" class="sidebar">
          <el-card style="margin-bottom:20px;" v-show="model.user_info.id!=0">
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
          </el-card>
          <!--  -->

          <el-card
            class="aside-list"
            shadow="never"
            :body-style="{ padding: '12px'}"
            :style="this.aside>260?'position: fixed;top:80px;width:260px;':''"
          >
            <div slot="header" class="clearfix">
              <span>目录</span>
            </div>
            <!-- <div class="wx_navigation">
              <div class="navigator-item-title">目录</div>
            </div>-->
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
import articleApi from "../../models/article";
import subscribeApi from "../../models/subscribe";
import ToolsBadge from "./ToolsBadge";
import CommentList from "@/views/comment/CommentList";
import { SubscribeButton } from "@/views/subscribe";
import Error404Page from "@/views/error-page/404";
import { MarkdownPreview } from "vue-meditor";
export default {
  name: "ArticleDetail",
  data() {
    return {
      model: {
        user_info: {
          id: 0
        },
        tags: [],
        content: ""
      },
      subscribeLoading: false,
      scroll: 0,
      aside: 0,
      currentIndex: 0,
      heightArr: [],
      nodes: [],
      avatarUrl: "",
      loading: false,
      deleted: false,
      is_subscribeed: null
    };
  },
  components: {
    ToolsBadge,
    CommentList,
    SubscribeButton,
    Error404Page,
    MarkdownPreview
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  async created() {
    await this.getData();
    this.init();
    this.activeIndex = 0;
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("scroll", this.dataScroll, true);
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
    goBack() {
      this.$router.replace("/index");
    },
    likeChange({ likes_quantity, is_liked }) {
      this.model.likes_quantity += likes_quantity;
      this.model.is_liked = is_liked;
    },
    async getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading"
      });
      try {
        this.deleted = false;

        this.model = await articleApi.getArticle(this.id).finally(() => {
          loading.close();
        });
        if (this.model.word_number == 0) {
          this.model.word_number = this.model.content.length;
          this.model.reading_time = Number(
            this.model.word_number / 800
          ).toFixed(0);
        }
        if (this.model.user_info == undefined) {
          this.model.user_info = {
            id: 0
          };
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
          .getElementById("preview")
          .querySelectorAll("h1,h2,h3,h4,h5")
          .forEach((item, index) => {
            this.heightArr.push(item.offsetTop - 30);
          });
        this.nodes = document
          .getElementById("navigation")
          .getElementsByClassName("navigator-item");
      });
    },
    dataScroll: function() {
      this.scroll =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        document.querySelector("#preview").scrollTop;

      this.aside =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        document.querySelector(".aside-list").scrollTop;
    },
    loadSroll() {
      var self = this;
      for (let i = 0; i < this.heightArr.length - 1; i++) {
        if (this.nodes[i] && this.nodes[i].classList != undefined) {
          if (
            this.scroll >= this.heightArr[i] &&
            this.scroll <= this.heightArr[i + 1]
          ) {
            this.nodes[i].classList.add("active");
          } else {
            this.nodes[i].classList.remove("active");
          }
        }
      }
    },
    buildNavigation() {
      var navigation = document.getElementById("navigation");
      let articleId = this.id;
      const nodes = document
        .getElementById("preview")
        .querySelectorAll("h1,h2,h3,h4,h5");
      var newDoms = [];
      var router = this.$router;
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
          var cloneNode = node.cloneNode();

          cloneNode.classList.add("navigator-item");
          const a = document.createElement("a");

          // a.href = `/#/post/${articleId}#${domId}`;
          a.id = domId;
          a.setAttribute("articleId", articleId);
          a.innerHTML = node.innerText;
          cloneNode.appendChild(a);
          cloneNode.onclick = function() {
            var parents = cloneNode.parentElement.children;
            for (let j = 0; j < parents.length; j++) {
              parents[j].classList.remove("active");
            }
            cloneNode.classList.add("active");
            let id = this.children[0].id;
            let articleId = this.children[0].getAttribute("articleId");

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
        return "";
      }
      const sliceDoms = []; // 归类好的节点树

      newDoms.forEach((dom, i) => {
        // 把标题归类 每部分的标题组合到一起
        const level = dom.tagName.substr(1);
        const upLevel = newDoms[i - 1] ? newDoms[i - 1].tagName.substr(1) : "";

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
          dom.classList.add("heading_" + domHeadingLevel);
        });
      });
    },
    subscribe(is_subscribeed) {
      this.is_subscribeed = is_subscribeed;
    }
  }
};
</script>

<style  lang="scss" scoped>
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
  img {
    width: fit-content;
  }
  .markdown-theme-dark pre code,
  .code-block p {
    color: #fff;
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
  content: "";
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