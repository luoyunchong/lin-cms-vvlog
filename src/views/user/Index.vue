<template>
  <div style="background:#fff">
    <v-list :dataSource="listData" itemLayout="vertical" :bordered="true">
      <template v-slot:renderItem="{item,index}">
        <v-list-item>
          <li slot="actions" v-for="{type,text} in item.actions" v-bind:key="type">
            <span>
              <i :class="type" style="margin-right: 8px" />
              {{text}}
              <em class="vv-list-item-action-split" />
            </span>
          </li>
          <v-list-item-meta :description="item.description">
            <a slot="title" :href="item.href">{{item.title}}</a>
            <el-avatar slot="avatar" :src="item.avatar" />
          </v-list-item-meta>
          <template slot="content">{{item.content}}</template>
        </v-list-item>
      </template>
    </v-list>
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
    return {
      listData: [
        {
          actions: [
            { type: "el-icon-s-help", text: "156" },
            { type: "el-icon-star-on", text: "156" }
          ],
          href: "https://www.antdv.com/",
          title: `ant design vue part `,
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description:
            "Ant Design, a design language for background applications, is refined by Ant UED Team.",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        },
        {
          actions: [
            { type: "el-icon-s-help", text: "156" },
            { type: "el-icon-star-on", text: "156" }
          ],
          href: "https://www.antdv.com/",
          title: `ant design vue part `,
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description:
            "Ant Design, a design language for background applications, is refined by Ant UED Team.",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        },
        {
          actions: [
            { type: "el-icon-s-help", text: "156" },
            { type: "el-icon-star-on", text: "156" }
          ],
          href: "https://www.antdv.com/",
          title: `ant design vue part `,
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description:
            "Ant Design, a design language for background applications, is refined by Ant UED Team.",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        },
        {
          actions: [
            { type: "el-icon-s-help", text: "156" },
            { type: "el-icon-star-on", text: "156" }
          ],
          href: "https://www.antdv.com/",
          title: `ant design vue part `,
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description:
            "Ant Design, a design language for background applications, is refined by Ant UED Team.",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        }
      ]
    };
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