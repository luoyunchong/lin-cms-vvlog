<template>
  <div class="content">
    <div class="page-header-index-wide">
      <el-row :gutter="24">
        <el-col :xl="17" :lg="16" :md="24" :sm="24" :xs="24">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{model.title}}</span>
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
          </el-card>
        </el-col>
        <el-col :xl="7" :lg="8" :md="24" :sm="24" :xs="24">
          <el-card class="aside-list" shadow="never" :body-style="{ padding: '12px'}">
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
    </div>
  </div>
</template>

<script>
import articleApi from "../../models/article";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "ArticleDetail",
  data() {
    return {
      model: {},
      scroll: 0,
      currentIndex: 0,
      heightArr: [],
      nodes: []
    };
  },
  components: {
    mavonEditor
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("scroll", this.dataScroll, true);
    });
  },
  watch: {
    scroll: function() {
      this.loadSroll();
    }
  },
  methods: {
    async getData() {
      this.model = await articleApi.getArticle(this.id);
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
        document.querySelector(".el-main").scrollTop;
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
            window.location.replace("#" + this.children[0].id);
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

<style  lang="scss">
.content {
  margin: 24px 24px 0;
}
.page-header-index-wide {
  max-width: 1200px;
  margin: 0 auto;
}
.mavon-editor .v-note-wrapper .v-note-panel {
  border: none;
}
.mavon-editor .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
  background: #fff;
}

.aside-list {
  position: fixed;
  width: 240px;
  transition: all 0.2s;
}

/** navigatior*/
.wx_navigation {
  position: relative;
}

.wx_navigation::before {
  content: "";
  position: absolute;
  top: 0;
  left: 2px;
  bottom: 0;
  width: 2px;
  background-color: #ebedef;
  opacity: 0.5;
}

.wx_navigation > .navigator-item,
.wx_navigation > .navigator-item-title {
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

.wx_navigation > .navigator-item > a {
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
.wx_navigation > .navigator-item {
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
</style>