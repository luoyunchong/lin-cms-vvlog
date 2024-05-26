<template>
  <div class="padding-xs">
    <el-button @click="createClassify()" icon="Edit">新建专栏</el-button>
    <div class="margin-top-xs">
      <v-list
        itemLayout="horizontal"
        :dataSource="listData"
        :bordered="false"
        v-loading="loading"
        class="list"
        :pagination="pagination"
      >
        <template v-slot:renderItem="{ item, index }">
          <v-list-item class="item">
            <template #actions>
              <li v-show="showActions">
                <el-button @click="updateClassify(item.id)">编辑</el-button>
                <el-button @click="deleteClassify(item.id)">删除</el-button>
              </li>
            </template>
            <v-list-item-meta :description="item.remark">
              <template #title>
                <router-link :to="{ path: `/classify/${item.id}` }" target="_blank">
                  {{ item.classify_name }}
                </router-link>
              </template>
            </v-list-item-meta>
          </v-list-item>
        </template>
        <template #footer>
          <div></div>
        </template>
      </v-list>
    </div>

    <classify-form-dialog ref="createClassify" v-on:success="() => onCreateClassifySuccess()"></classify-form-dialog>
  </div>
</template>

<script>
import classifyApi from '@/model/classify'
import VList from '@/component/list'
import '@/component/list/index.css'
import defaultAvatar from '@/assets/image/user/user.png'
import ClassifyFormDialog from './classify-form-dialog.vue'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'ClassifyList',
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    ClassifyFormDialog,
  },
  props: {
    showActions: {
      type: [Boolean],
      default: true,
    },
    userId: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      classifyId: 0,
      listData: [],
      loading: false,
      query: {
        name: '',
      },
      pagination: {
        small: false,
        background: true,
        currentPage: 1,
        position: 'bottom',
        total: 0,
        currentChange: page => {
          console.log(page)
          this.pagination.currentPage = page
          this.getData()
        },
        pageSize: 15,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize
          this.pagination.currentPage = currentPage
          this.getData()
        },
      },
      defaultAvatar,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  async created() {
    await this.getData()
  },
  async activated() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await classifyApi.getClassifys({
        page: this.pagination.currentPage - 1,
        count: this.pagination.pageSize,
        userid: this.user.id,
      })
      this.listData = res.items
      this.pagination.count = res.count

      this.loading = false
    },
    createClassify() {
      this.$refs['createClassify'].show(0)
    },
    updateClassify(id) {
      this.$refs['createClassify'].show(id)
    },
    deleteClassify(id) {
      ElMessageBox.confirm('此操作将永久删除该专栏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        classifyApi.deleteClassify(id).then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
      })
    },
    async onCreateClassifySuccess() {
      await this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  .item {
    cursor: pointer;
    padding-left: 10px;

    &:hover {
      background: #e6f7ff;
    }
  }
}
</style>
