<template>
  <div>
    <el-card>
      <div slot="header">我创建的个人专栏</div>
      <div>
        <el-tag
          :hit="false"
          type="success"
          class="margin-left-xs margin-bottom-xs"
          :effect="classify_id==undefined?'dark':'plain'"
        >
          <router-link :to="{path:`/user/${user.id}/article`}">全部</router-link>
        </el-tag>
        <template v-for="item in classifys">
          <el-tag
            :hit="false"
            :effect="item.id==classify_id?'dark':'plain'"
            type="success"
            v-bind:key="item.id"
            class="margin-left-xs margin-bottom-xs"
          >
            <router-link
              :to="{path:`/user/${user.id}/article?classify_id=${item.id}`}"
            >{{item.classify_name}}</router-link>
          </el-tag>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import classifyApi from "@/models/classify";
export default {
  name: "MyCreateClassify",
  data() {
    return {
      classifys: []
    };
  },
  computed: {
    classify_id() {
      return this.$route.query.classify_id;
    }
  },
  async created() {
    this.getClassifys();
  },
  methods: {
    async getClassifys() {
      let res = await classifyApi.getClassifys({
        user_id: this.user.id
      });
      this.classifys = res;
    }
  }
};
</script>

<style>
</style>