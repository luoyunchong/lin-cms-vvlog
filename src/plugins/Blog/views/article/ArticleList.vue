<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">我的随笔</div>
        </div>
        <div class="header-right">
          <el-input
            size="medium"
            style="margin-right:10px;"
            v-model="pagination.title"
            placeholder="标题"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="()=>{
                this.showEdit = true;
                this.id = null;
            }"
          >新增随笔</el-button>
          <el-button type="default" icon="el-icon-search" @click="getArticles">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
        :pagination="pagination"
        @currentChange="handleCurrentChange"
      ></lin-table>
    </div>
    <article-form v-else @editClose="editClose" :id="id"></article-form>
  </div>
</template>

<script>
import LinTable from '@/components/base/table/lin-table'
import articleApi from '../../models/article'
import ArticleForm from './ArticleForm'

function format_str() {
  for (var i = 1; i < arguments.length; i++) {
    var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
    arguments[0] = arguments[0].replace(exp, arguments[i])
  }
  return arguments[0]
}

function image_preview_dialog(url) {
  console.log(url)
}

export default {
  name: 'articleList',
  components: { LinTable, ArticleForm },
  inject: ['eventBus'],
  data() {
    return {
      id: null,
      showEdit: false,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      // total: 0, // 分组内的用户总数
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      activeTab: '修改信息',
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
        title: '',
      },
    }
  },
  methods: {
    editClose() {
      this.showEdit = false
      this.getArticles()
    },
    async getArticles() {
      let res
      const currentPage = this.pagination.currentPage - 1
      try {
        this.loading = true
        res = await articleApi.getArticles({
          count: this.pagination.pageSize,
          page: currentPage,
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
        this.tableData = [...res.items]
        this.pagination.pageTotal = res.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleEdit(val) {
      this.editIndex = val.index
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单击 table row
        selectedData = val
      }
      this.showEdit = true
      this.id = selectedData.id
      // this.$router.push({
      //   name: "articleFormEdit",
      //   params: { id: selectedData.id }
      // });
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getArticles()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该随笔, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await articleApi.deleteArticle(val.row.id)
        this.loading = false

        this.$message({
          type: 'success',
          message: `${res.msg}`,
        })
        await this.getArticles()
      })
    },
    // 双击 table ro
    rowClick(row) {
      this.handleEdit(row)
    },
  },
  async created() {
    await this.getArticles()
    this.tableColumn = [
      { prop: 'title', label: '标题', width: 400 },
      { prop: 'author', label: '作者' },
      { prop: 'comment_quantity', label: '评论数', width: 100 },
      { prop: 'likes_quantity', label: '点赞数', width: 100 },
      { prop: 'view_hits', label: '阅读数', width: 100 },
      { prop: 'time_span', label: '发布时间' },
      {
        prop: 'id',
        label: '状态',
        customRender: function(row, column) {
          var isaudit = format_str(
            '<i title="{0}" class="el-icon-{1}"></i>',
            row.is_audit ? '已审核' : '未审核',
            row.is_audit ? 'check' : 'close'
          )

          var isremd = format_str(
            '<i  style="margin-left:10px;" title="{0}" class="el-icon-{1}"></i>',
            row.is_stickie ? '置顶' : '未置顶',
            row.is_stickie ? 'top' : 'bottom'
          )

          var isstickie = format_str(
            '<i  style="margin-left:10px;" title="{0}" class="el-icon-{1}"></i>',
            row.recommend ? '推荐' : '未推荐',
            row.recommend ? 'thumb' : 'ice-cream-square'
          )
          return isaudit + isremd + isstickie
        },
      },
      {
        prop: 'is_audit',
        label: '关键字/来源/摘要/缩略图',
        customRender: function(row, column) {
          var d = format_str(
            '<i class="el-icon-{0}"></i><i class="el-icon-{1}" style="margin-left:10px;"></i><i class="el-icon-{2}" style="margin-left:10px;"></i>',
            row.keywords ? 'check' : 'close',
            row.source ? 'check' : 'close',
            row.excerpt ? 'check' : 'close'
          )
          if (row.thumbnail) {
            var thumurl = format_str(
              '<i class="el-icon-picture"  style="margin-left:10px;"></i>',
              row.thumbnail
            )
            d += thumurl
          }
          return d
        },
      },
    ] // 设置表头信息

    this.operate = [
      { name: '原文', func: 'handleDetail', type: 'default' },
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/list.scss';
</style>
