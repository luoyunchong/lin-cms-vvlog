<template>
  <div class="page-header-index-wide">
    <el-row :gutter="24">
      <el-col :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <el-page-header @back="goBack"></el-page-header>
          </div>
          <div class="info-box" v-loading="loading">
            <el-row type="flex">
              <el-col :span="2">
                <a href>
                  <el-avatar size="large" :src="model.user_info.avatar"></el-avatar>
                </a>
              </el-col>
              <el-col>
                <el-row :gutter="10">
                  <el-col :span="18" :xs="18">
                    <el-col :span="24">
                      <a class="nickname">{{model.user_info.nickname}}</a>
                    </el-col>
                    <el-col :span="24">
                      <span>{{model.time_span}}</span>
                      <el-divider direction="vertical"></el-divider>
                      <span>阅读 {{model.view_hits}}</span>
                      <template v-if="user!=null&&model.user_info.id==user.id">
                        <el-divider direction="vertical"></el-divider>
                        <el-link type="primary" href="https://element.eleme.io" target="_blank">编辑</el-link>
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
                    style="text-align:left;padding-left:0px;"
                    v-if="user!=null&&model.user_info.id!=user.id"
                  >
                    <el-button type="primary" icon="el-icon-plus">关注他</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="info-box">
            <h1 class="title">{{model.title}}</h1>
          </div>
          <div class="info-box">
            <el-alert :title="`本文共${model.word_number}字,阅读约需${model.reading_time}分钟。`" type="info"></el-alert>
          </div>
          <div class="mavon-editor">
            <mavon-editor
              id="mavon-editor"
              ref="mavon"
              :toolbarsFlag="false"
              :editable="false"
              :readModel="true"
              defaultOpen="preview"
              :subfield="false"
              v-model="model.content"
              :boxShadow="false"
              previewBackground="#fff"
              :navigation="false"
            />
          </div>
          <div class="info-box top20">
            <h3 class="tag-title">标签</h3>
            <el-tag effect="light" type="success" v-bind:key="item.id" v-for="item in model.tags">
              <a :href="'/tag/'+item.id" target="_blank">{{item.tag_name}}</a>
            </el-tag>
          </div>
        </el-card>
        <div id="comment-list">
          <comment-list :subject_id="id" :subject_type="1" v-on:success="getCommentSuccess"></comment-list>
        </div>
        <el-backtop class="lin-back-top"></el-backtop>
      </el-col>
      <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
        <el-card style="margin-bottom:20px;">
          <div slot="header" class="clearfix" :body-style="{ padding: '0'}">
            <span>关于作者</span>
          </div>
          <div class="info-box" style="display: flex;">
            <div style="flex: 0 0 auto;margin-right: 1rem;">
              <a href class="avatar">
                <el-avatar size="large" :src="model.user_info.avatar"></el-avatar>
              </a>
            </div>
            <div style="flex: 1 1 auto;min-width: 0;">
              <a class="nickname">{{model.user_info.nickname}}</a>
              <div class="intro-content">{{model.user_info.introduction}}</div>
            </div>
          </div>
        </el-card>
        <el-card
          class="aside-list"
          :style="this.scroll>260?'position: fixed;top:80px':''"
          shadow="never"
          :body-style="{ padding: '12px'}"
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
</template>

<script>
import articleApi from "../../models/article";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import ToolsBadge from "./ToolsBadge";
import CommentList from "@/views/comment/CommentList";

export default {
  name: "ArticleDetail",
  data() {
    return {
      model: {
        user_info: {}
      },
      scroll: 0,
      currentIndex: 0,
      heightArr: [],
      nodes: [],
      avatarUrl: "",
      loading: false
    };
  },
  components: {
    mavonEditor,
    ToolsBadge,
    CommentList
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  created() {
    this.getData();
    this.activeIndex = 0;
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("scroll", this.dataScroll, true);
    });
  },
  watch: {
    scroll() {
      // this.loadSroll();
    },
    $route(to, from) {
      this.getData();
    }
  },
  methods: {
    getCommentSuccess(total) {
      this.model.comment_quantity = total;
      console.log("getCommentSuccess");
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
      this.model = await articleApi.getArticle(this.id).finally(() => {
        loading.close();
      });
      console.log("getData");
      if (this.model.word_number == 0) {
        this.model.word_number = this.model.content.length;
        this.model.reading_time = Number(this.model.word_number / 800).toFixed(
          0
        );
      }
      this.init();
    },
    init() {
      this.$nextTick(() => {
        this.buildNavigation();

        var manveEditor = document.getElementById("mavon-editor");
        const nodes = manveEditor.children;
        manveEditor.children[1]
          .querySelectorAll("h1,h2,h3,h4,h5")
          .forEach((item, index) => {
            // console.log(item.textContent);
            this.heightArr.push(item.offsetTop);
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
        document.querySelector(".aside-list").scrollTop;
    },
    loadSroll() {
      var self = this;
      for (let i = 0; i < this.heightArr.length - 1; i++) {
        if (
          this.scroll >= this.heightArr[i] &&
          this.scroll <= this.heightArr[i + 1]
        ) {
          this.nodes[i].classList.add("active");
        } else {
          this.nodes[i].classList.remove("active");
        }
      }
    },
    buildNavigation() {
      var a = document.getElementById("navigation");
      a.innerHTML = this.$refs.mavon.d_render; // mavmon根据marodown内容生成的dom

      const nodes = a.children;
      var newDoms = [];
      var router = this.$router;
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const id =
            nodes[i].children && nodes[i].children.length
              ? nodes[i].children[0].id
              : "";
          judageH(nodes[i], i, nodes, id);
        }
      }
      function judageH(node, i, nodes, domId) {
        const reg = /^H[1-6]{1}$/;
        if (!reg.exec(node.tagName)) {
          // 把不是h标签的都过滤掉
          node.style.display = "none";
          // node.remove();
        } else {
          node.classList.add("navigator-item");
          const nodeArr = node.innerHTML.split("</a>");

          // const id = nodeArr[0].replace(/[^0-9]+/g, '')
          const id = domId;
          const content = nodeArr[1];

          var childs = node.childNodes;
          for (var index = childs.length - 1; index >= 0; index--) {
            node.removeChild(childs[index]);
          }

          const a = document.createElement("a");

          // a.href = "#" + id;
          a.id = id;
          a.innerHTML = content;
          node.appendChild(a);
          // console.log(id, content, node.tagName)
          node.onclick = function() {
            var parents = node.parentElement.children;
            for (let j = 0; j < parents.length; j++) {
              parents[j].classList.remove("active");
            }
            node.classList.add("active");
            let id = "#" + this.children[0].id;
            if (location.hash == id) {
              return;
            }
            router.replace(id);
          };
          newDoms.push(node);
        }
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
  margin-bottom: 10px;
  .title {
    margin-top: 1rem;
    padding: 0 0 0 1rem;
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
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 18px;
    color: #333;
    display: inline-block;
    margin-bottom: 8px;
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
  }
}
.mavon-editor {
  width: 100%;
}
.mavon-editor /deep/ .v-note-wrapper .v-note-panel {
  border: none;
  .v-note-show .v-show-content {
    background: #fff;
  }
  a:target {
    padding-top: 80px;
  }
}

.mavon-editor /deep/ .markdown-body {
  font-size: 14px;
}

@media (max-width: 600px) {
  .box-card .el-card__body {
    padding: 0px;
    padding-top: 20px;
  }
  .mavon-editor .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
    width: 100vw;
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
  // position: fixed;
  // width: 240px;
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
</style>