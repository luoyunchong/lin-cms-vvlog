<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">分类专栏列表</div>
        </div>

        <div class="header-right">
          <div style="margin-left:30px">
            <el-button
              v-auth="'新增分类专栏'"
              type="primary"
              icon="el-icon-edit"
              @click="()=>{
                this.showEdit = true;
                this.id = 0;
            }"
            >新增分类专栏</el-button>
            <el-button type="default" icon="el-icon-search" @click="refresh">刷新</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      >
        <template v-slot:thumbnail_display="scope">
          <div class="thumb" :style="'background-image: url('+scope.row.thumbnail_display+');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <classify-form v-else @editClose="editClose" :id="id"></classify-form>
  </div>
</template>

<script>
import classifyApi from '../../models/classify'
import LinTable from '@/components/base/table/lin-table'
import ClassifyForm from './ClassifyForm'
import Vue from 'vue'
export default {
  name: 'ClassifyList',
  components: { LinTable, ClassifyForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
    }
  },
  methods: {
    async getClassifys() {
      let res
      try {
        this.loading = true
        res = await classifyApi.getClassifys()
        setTimeout(() => {
          this.loading = false
        }, 500)
        this.tableData = res
      } catch (e) {
        this.loading = false
      }
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分类专栏项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await classifyApi.deleteClassify(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.error_code === 0) {
          this.loading = false
          await this.getClassifys()

          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.msg}`)
        }
      })
    },
    async refresh() {
      await this.getClassifys()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getClassifys()
      this.loading = false
    },

    async editClose() {
      this.showEdit = false
      await this.getClassifys()
    },
  },
  async created() {
    this.tableColumn = [
      { prop: 'classify_name', label: '分类专栏' },
      {
        prop: 'thumbnail_display',
        label: '封面',
        scopedSlots: { customRender: 'thumbnail_display' },
      },
      { prop: 'sort_code', label: '排序码' },
      {
        prop: 'create_time',
        label: '创建时间',
        scope: 'create_time',
        customRender: function(row, column) {
          return Vue.filter('filterTimeYmdHms')(column)
        },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', auth: '编辑标签' },
      { name: '删除', func: 'handleDelete', type: 'danger', auth: '删除标签' },
    ]

    await this.getClassifys()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/list.scss';
</style>
