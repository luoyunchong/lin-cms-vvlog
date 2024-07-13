<template>
  <div>
    <v-list itemLayout="horizontal" :dataSource="listData" :bordered="false" v-loading="loading" class="list"
      :pagination="pagination">
      <template v-slot:renderItem="{ item, index }">
        <v-list-item class="item">
          <template #actions>
          </template>
          <v-list-item-meta>
            <template #title>
              <router-link :to="{ path: `/user/${userId}/classify?classify_id=${item.id}` }" target="_blank">
                {{ item.classify_name }}
              </router-link>
            </template>
            <template #description>
              <span class="fn-ellpisis1 item">{{ $filters.filterTimeYmdHms(item.create_time) }}</span>
              <span class="fn-ellpisis1 item">文章数 {{ item.article_count }}</span>

            </template>
            <template #avatar>
              <el-avatar :src="item.thumbnail_display" shape="square" style="height: 84px;width: 150px;">
                <img src=" https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
            </template>
          </v-list-item-meta>
        </v-list-item>
      </template>
      <template #footer>
        <div></div>
      </template>
    </v-list>
  </div>
</template>

<script>
  import classifyApi from '@/model/classify'
  import VList from '@/component/list'

  export default {
    name: 'MyCreateClassify',
    components: {
      VList,
      VListItem: VList.Item,
      VListItemMeta: VList.Item.Meta,
    },
    data() {
      return {
        listData: [],
      }
    },
    computed: {
      userId() {
        return this.$route.params.id
      },
      classify_id() {
        return this.$route.query.classify_id
      },
      name() {
        return this.user.id == this.userId ? '我创建的个人专栏' : '他的个人专栏'
      },
      user() {
        return this.$store.state.user
      },
    },
    async created() {
      this.getClassifys()
    },
    methods: {
      async getClassifys() {
        let res = await classifyApi.getClassifys({
          user_id: this.userId,
        })
        this.listData = res.items
      },
    },
  }
</script>

<style>
  .item:not(:last-child)::after {
    content: '·';
    color: rgb(178, 186, 194);
    margin: 0px 0.4em;
  }

</style>
