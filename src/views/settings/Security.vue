<template>
  <div class="container">
    <v-list itemLayout="horizontal" :dataSource="listData" :bordered="false" v-loading="loading">
      <template v-slot:renderItem="{item,index}">
        <v-list-item>
          <li
            slot="actions"
            v-for="(actionItem,actionIndex) in item.actions"
            v-bind:key="actionIndex"
          >
            <a @click="actionItem.click">{{actionItem.text}}</a>
          </li>
          <v-list-item-meta :description="item.description">
            <a slot="title">{{item.title}}</a>
          </v-list-item-meta>
        </v-list-item>
      </template>
    </v-list>
    <change-pwd-dialog ref="changePwdDialog"></change-pwd-dialog>
  </div>
</template>

<script>
import VList from "@/components/list";
import "@/components/list/index.css";
import ChangePwdDialog from "./ChangePwdDialog";
export default {
  components: {
    VList,
    VListItem: VList.Item,
    VListItemMeta: VList.Item.Meta,
    ChangePwdDialog
  },
  data() {
    return {
      listData: [
        {
          actions: [
            {
              text: "编辑",
              click: () => {
                this.$refs["changePwdDialog"].show();
              }
            }
          ],
          title: `账户密码`,
          description: "已设置",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        }
      ],
      loading: false
    };
  },
  name: "Security",
  methods: {}
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
}
</style>