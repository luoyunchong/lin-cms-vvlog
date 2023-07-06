<template>
  <el-dialog width="500px" title="新建收藏集" :append-to-body="true" :before-close="handleClose" v-model="dialogVisible"
    class="user-dialog" :close-on-click-modal="false">
    <el-button @click="createCollection()" v-if="showCreateCollection">新建收藏集</el-button>
    <el-form :model="form" label-width="120px">
      <el-radio-group v-model="formdata.collection_id" :span="24">
        <v-list itemLayout="horizontal" :dataSource="listData" :bordered="false" v-loading="loading" class="list"
          :pagination="pagination">
          <template v-slot:renderItem="{ item, index }">
            <v-list-item class="item">
              <template #actions>
                <li>
                  <el-radio :label="item.id" size="large">选择</el-radio>
                </li>
              </template>
              <v-list-item-meta :description="item.remark">
                <template #title>
                  {{ item.name }}
                  <span><el-icon>
                      <Lock v-if="item.privacy_type == 1" />
                    </el-icon></span>
                </template>
              </v-list-item-meta>
            </v-list-item>
          </template>
          <template #footer>
            <div></div>
          </template>
        </v-list>
      </el-radio-group>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="submitForm('form')">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
    <collection-form ref="createCollection" v-on:success="() => onCreateCollectionSuccess()"></collection-form>
  </el-dialog>
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
    CollectionForm
  },
  props: {
  },
  data() {
    return {
      showCreateCollection: true,
      saveLoading: false,
      dialogVisible: false,
      listData: [],
      loading: false,
      query: {
        name: ''
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
      formdata: {
        collection_id: 0,
        article_id: 0
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    show(article_id) {
      this.dialogVisible = true
      this.getData()
      this.formdata.article_id = article_id;
    },
    async getData() {
      this.loading = true
      let res = await collectionApi.getCollectionList({
        page: this.pagination.currentPage - 1,
        count: this.pagination.pageSize,
        userid: this.user.id
      });
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
    async onCreateCollectionSuccess() {
      await this.getData()
    },
    async submitForm(form) {
      if (this.formdata.collection_id == 0) {
        ElMessageBox.alert('请选择收藏集', '提示')
        return
      }
      var res = await collectionApi.createOrCancelCollection(this.formdata)
      this.$message.success(`${res.message}`);
      this.$emit('success', this.formdata.collection_id)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;

  .item {
    cursor: pointer;
    padding-left: 10px;

    &:hover {
      background: #e6f7ff;
    }
  }
}
</style>
