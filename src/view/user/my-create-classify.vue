<template>
  <div>
    <el-card>
      <template #header>
        <span>{{ name }}</span>
      </template>
      <div>
        <el-tag
          :hit="false"
          type="success"
          class="margin-left-xs margin-bottom-xs"
          :effect="classify_id == undefined ? 'dark' : 'plain'"
        >
          <router-link :to="{ path: `/user/${userId}/article` }">全部</router-link>
        </el-tag>
        <template v-for="item in classifys">
          <el-tag
            :hit="false"
            :effect="item.id == classify_id ? 'dark' : 'plain'"
            type="success"
            v-key="item.id"
            class="margin-left-xs margin-bottom-xs"
          >
            <router-link :to="{ path: `/user/${userId}/article?classify_id=${item.id}` }"
              >{{ item.classify_name }}
            </router-link>
          </el-tag>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import classifyApi from '@/model/classify'
export default {
  name: 'MyCreateClassify',
  data() {
    return {
      classifys: [],
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
      this.classifys = res
    },
  },
}
</script>

<style></style>
