<template>
  <el-card class="aside-list" shadow="never" :body-style="{ padding: '12px' }">
    <template #header>
      <div class="clearfix">
        <span>目录</span>
      </div>
    </template>
    <!-- <div class="wx_navigation">
              <div class="navigator-item-title">目录</div>
    </div>-->

    <div id="navigation" class="wx_navigation">
      <div v-html="innerHTML"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      innerHTML: '',
    }
  },
  created() {},
  methods: {
    async getData() {
      this.model = await articleApi.getArticle(this.id)
      this.$nextTick(() => {
        this.buildNavigation()
      })
    },
    buildNavigation() {
      //   let a = document.getElementById("navigation");
      //   a.innerHTML = this.$refs.mavon.d_render; // mavmon根据marodown内容生成的dom

      const nodes = a.children
      let newDoms = []

      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const id = nodes[i].children && nodes[i].children.length ? nodes[i].children[0].id : ''
          judageH(nodes[i], i, nodes, id)
        }
      }
      function judageH(node, i, nodes, domId) {
        const reg = /^H[1-6]{1}$/
        if (!reg.exec(node.tagName)) {
          // 把不是h标签的都过滤掉
          node.style.display = 'none'
          // node.remove();
        } else {
          node.classList.add('navigator-item')
          const nodeArr = node.innerHTML.split('</a>')

          // const id = nodeArr[0].replace(/[^0-9]+/g, '')
          const id = domId
          const content = nodeArr[1]

          let childs = node.childNodes
          for (let index = childs.length - 1; index >= 0; index--) {
            node.removeChild(childs[index])
          }

          const a = document.createElement('a')

          a.id = id
          a.innerHTML = content
          node.appendChild(a)
          // console.log(id, content, node.tagName)
          node.onclick = function () {
            window.location.replace('#' + this.children[0].id)
          }
          newDoms.push(node)
        }
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
  },
}
</script>

<style lang="scss" scoped></style>
