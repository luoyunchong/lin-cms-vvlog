<template>
  <div>
    <el-button @click="createCollection()" v-if="showCreateCollection">新建收藏集</el-button>
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
            <li v-show="showActions && showCreateCollection">
              <el-button @click="updateCollection(item.id)">编辑</el-button>
              <el-button @click="deleteCollection(item.id)">删除</el-button>
            </li>
          </template>
          <v-list-item-meta :description="item.remark">
            <template #title>
              <router-link :to="{ path: `/collection/${item.id}` }" target="_blank">
                {{ item.name }}
                <span
                  ><el-icon>
                    <Lock v-if="item.privacy_type == 1" /> </el-icon
                ></span>
              </router-link>
            </template>
          </v-list-item-meta>
        </v-list-item>
      </template>
      <template #footer>
        <div></div>
      </template>
    </v-list>
    <collection-form ref="createCollection" v-on:success="() => onCreateCollectionSuccess()"></collection-form>
  </div>
</template>

<script>
import collectionApi from '@/model/collection'
import VList from '@/component/list'
import '@/component/list/index.css'
import defaultAvatar from '@/assets/image/user/user.png'
import CollectionForm from '@/view/collection/collection-form'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'CollectionList',
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    CollectionForm,
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
      collectionId: 0,
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
    showCreateCollection() {
      return this.user?.id == this.userId
    },
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
      let res = await collectionApi.getCollectionList({
        page: this.pagination.currentPage - 1,
        count: this.pagination.pageSize,
        userid: this.userId,
      })
      this.listData = res.items
      this.pagination.count = res.count

      this.loading = false
    },
    createCollection() {
      this.$refs['createCollection'].show()
    },
    updateCollection(id) {
      this.$refs['createCollection'].show(id)
    },
    deleteCollection(id) {
      ElMessageBox.confirm('此操作将永久删除该收藏集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        collectionApi.deleteCollection(id).then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
      })
    },
    async onCreateCollectionSuccess() {
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
