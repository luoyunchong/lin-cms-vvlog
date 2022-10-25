<template>
  <div class="container">
    <v-list itemLayout="horizontal" :dataSource="listData" :bordered="false" v-loading="loading">
      <template v-slot:renderItem="{ item, index }">
        <v-list-item>
          <template #actions>
            <li v-for="(actionItem, actionIndex) in item.actions" v-bind:key="actionIndex">
              <a @click="actionItem.click">{{ actionItem.text }}</a>
            </li>
          </template>
          <v-list-item-meta :description="item.description">
            <template #title>{{ item.title }}</template>
          </v-list-item-meta>
        </v-list-item>
      </template>
    </v-list>
    <change-pwd-dialog ref="changePwdDialog"></change-pwd-dialog>
  </div>
</template>

<script>
import VList from '@/component/list'
import '@/component/list/index.css'
import ChangePwdDialog from './change-pwd-dialog'
export default {
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    ChangePwdDialog,
  },
  data() {
    return {
      listData: [
        {
          actions: [
            {
              text: '编辑',
              click: () => {
                this.$refs['changePwdDialog'].show()
              },
            },
          ],
          title: `账户密码`,
          description: '已设置',
          content: '',
        },
      ],
      loading: false,
    }
  },
  name: 'Security',
  methods: {},
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
}
</style>
