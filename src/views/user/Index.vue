<template>
  <div class="vv-list">
    <div class="vv-list-item">
      <v-list-item-meta
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      >
        <a slot="title" href="https://vue.ant.design/">Ant Design Title 1</a>
        <el-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </v-list-item-meta>
    </div>
  </div>
</template>

<script>
import followApi from "@/models/follow";
import VList from "@/components/list";
import "@/components/list/index.css";

export default {
  name: "UserIndex",
  components: { VList, VListItem: VList.Item, VListItemMeta: VList.Item.Meta },
  data() {
    return {};
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  async created() {
    await this.getFollows();
  },
  methods: {
    async getFollows() {
      let res = await followApi.getFollows({
        user_id: this.userId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import url("/components/list/index.scss");
</style>