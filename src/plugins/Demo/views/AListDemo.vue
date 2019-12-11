<template>
  <div style="background:#fff;padding: 42px 24px 50px;">
    <v-list itemLayout="horizontal" :dataSource="listData" :bordered="false" v-loading="loading">
      <template v-slot:renderItem="{item,index}">
        <v-list-item>
          <li slot="actions">
            <a>edit</a>
            <em class="vv-list-item-action-split" />
          </li>
          <li slot="actions">
            <a>more</a>
          </li>
          <v-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <a slot="title" href="https://vue.ant.design/">{{item.title}}</a>
            <el-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </v-list-item-meta>
        </v-list-item>
      </template>
      <div slot="footer">
        <div>footer="页却footerfooterfooter"</div>
        <div>footer="页却footerfooterfooter"</div>
        <div>footer="页却footerfooterfooter"</div>
      </div>
    </v-list>
    <br />
    <br />
    <br />
    <v-list :dataSource="listData" itemLayout="vertical" :bordered="false" :pagination="pagination">
      <template v-slot:renderItem="{item,index}">
        <v-list-item>
          <li slot="actions" v-for="{type,text} in item.actions" v-bind:key="type">
            <span>
              <i :class="type" style="margin-right: 8px;"></i>
              <span class="count">{{text}}</span>
              <em class="vv-list-item-action-split" />
            </span>
          </li>
          <img
            slot="extra"
            style="width:272px;"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
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
import VList from "@/components/list";
import "@/components/list/index.css";
export default {
  name: "AListDemo",
  components: { VList, VListItem: VList.Item, VListItemMeta: VList.Item.Meta },
  data() {
    return {
      listData: [],
      loading: false,
      pagination: {
        small: false,
        background: true,
        currentPage: 1,
        position: "bottom",
        total: 0,
        currentChange: page => {
          console.log(page);
          this.pagination.currentPage = page;
          this.getData();
        },
        pageSize: 5,
        onShowSizeChange: (currentPage, pageSize) => {
          this.pagination.pageSize = pageSize;
          this.pagination.currentPage = currentPage;
          this.getData();
        }
      }
    };
  },
  computed: {},
  async created() {
    await this.getData();
  },
  methods: {
    getData() {
      this.loading = true;

      let listData = [];
      for (var i = 1; i <= 5; i++) {
        listData.push({
          actions: [
            {
              type: "iconfont icon-like",
              text: i * this.pagination.currentPage
            },
            { type: "iconfont icon-comment", text: "156" }
          ],
          href: "https://www.antdv.com/",
          title: `ant design vue part `,
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description:
            "Ant Design, a design language for background applications, is refined by Ant UED Team.",
          content:
            "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
        });
      }

      this.listData = listData;
      this.pagination.total = 10;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>