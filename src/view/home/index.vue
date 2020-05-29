<template>
  <div>
    <el-row class="row-bg" :gutter="20">
      <el-col :span="24">
        <el-card
          :body-style="{ 'padding': '15px','overflow-x':'auto' }"
          shadow="never"
          style="margin-bottom:10px;border-radius: 8px;"
        >
          <ul class="nav-list">
            <li v-for="(item,index) in channels" v-bind:key="index" class="nav-item">
              <router-link
                :class="['el-link is-underline',channel==item.channel_code?'el-link--primary':'']"
                :to="{path:`/index/${item.channel_code}`}"
              >{{item.channel_name}}</router-link>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="24" class="margin-bottom-xs">
        <div v-for="(item,index) in channels" v-bind:key="index">
          <el-tag
            :hit="false"
            type="success"
            class="margin-left-xs margin-bottom-xs"
            v-if="item.channel_code==channel"
            :effect="channel!=undefined&&tag_name==undefined?'dark':'plain'"
          >
            <router-link :to="{path:`/index/${encodeURIComponent(item.channel_code)}`}">全部</router-link>
          </el-tag>
          <template v-for="tag in item.tags">
            <el-tag
              :hit="false"
              :effect="tag_name==tag.tag_name?'dark':'plain'"
              type="success"
              v-bind:key="tag.id"
              v-if="item.channel_code==channel"
              class="margin-left-xs"
            >
              <router-link
                :to="{path:`/index/${item.channel_code}/${encodeURIComponent(tag.tag_name)}`}"
              >{{tag.tag_name}}</router-link>
            </el-tag>
          </template>
        </div>
      </el-col>
      <el-col :xs="24" :md="17">
        <el-card
          :body-style="{ 'padding-bottom': '10px','padding-top':'10px' }"
          shadow="never"
          style="margin-bottom:10px;border-radius: 8px;"
        >
          <el-row>
            <el-col :span="24">
              <router-link
                :to="{path:latestArticle}"
                :class="['el-link is-underline',sort=='CreateTime'?'el-link--primary':'el-link--info']"
              >最新</router-link>
              <!-- <el-link :type="sort=='CreateTime'?'primary':'info'" :href="latestArticle">最新</el-link> -->
              <el-divider direction="vertical"></el-divider>
              <router-link
                :to="{path:threeDaysHottest}"
                :class="['el-link is-underline','el-link--'+hotType]"
              >热榜</router-link>
              <!-- <el-link :type="hotType" :href="threeDaysHottest">热榜</el-link> -->
              <el-select
                :value="sort"
                size="mini"
                @change="onChange"
                style="width:100px;"
                v-show="sort&&sort!='CreateTime'"
                class="margin-left-xs"
              >
                <el-option label="3天内" value="THREE_DAYS_HOTTEST"></el-option>
                <el-option label="7天内" value="WEEKLY_HOTTEST"></el-option>
                <el-option label="30天内" value="MONTHLY_HOTTEST"></el-option>
                <el-option label="全部" value="HOTTEST"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-card>
        <div>
          <article-list :dataSource="dataSource"></article-list>
        </div>
        <el-backtop></el-backtop>

        <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
          <span slot="no-more">
            <el-divider class="lin-divider">我也是有底线的...</el-divider>
          </span>
          <span slot="no-results">
            <el-divider class="lin-divider">暂无随笔...</el-divider>
          </span>
        </infinite-loading>
      </el-col>
      <el-col :xs="24" :md="7" class="sidebar">
        <div class="sidebar-block">
          <el-card
            :body-style="{ 'padding-bottom': '10px','padding-top':'10px' }"
            shadow="never"
            class="lin-card"
          >
            <div slot="header" class="clearfix">
              <span class="lin-title">分享你的创作</span>
            </div>
            <div>
              <router-link :to="{path:`/post/editor/0`}">
                <el-button type="primary" icon="el-icon-edit" plain>写随笔</el-button>
              </router-link>
            </div>
          </el-card>
          <hot-tag-card></hot-tag-card>
          <novices-card></novices-card>

          <el-card
            :body-style="{ 'padding-bottom': '10px','padding-top':'10px' }"
            shadow="never"
            class="lin-card"
          >
            <div slot="header" class="clearfix">
              <span class="lin-title">开源</span>
            </div>
            <div>
              <div class="margin-bottom-xs">
                <a href="https://github.com/luoyunchong/lin-cms-dotnetcore" target="_blank">
                  <el-button type="primary" icon="iconfont icon-github-fill">lin-cms-dotnetcore</el-button>
                </a>
              </div>
              <div class="margin-bottom-xs">
                <a href="https://github.com/luoyunchong/lin-cms-vue" target="_blank">
                  <el-button type="default" icon="iconfont icon-github-fill">lin-cms-vue</el-button>
                </a>
              </div>
              <div class="margin-bottom-xs">
                <a href="https://github.com/luoyunchong/lin-cms-vvlog" target="_blank">
                  <el-button type="warning" icon="iconfont icon-github-fill">lin-cms-vvlog</el-button>
                </a>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ArticleList from "@/view/article/article-list";
import InfiniteLoading from "vue-infinite-loading";
import articleApi from "@/model/article";
import channelApi from "@/model/channel";
import HotTagCard from "@/view/tag/hot-tag-card";
import NovicesCard from "@/view/home/novices-card";

export default {
  name: "HomeIndex",
  components: { ArticleList, InfiniteLoading, HotTagCard, NovicesCard },
  data() {
    return {
      count: 20,
      dataSource: [],
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0,
        channel_id: null,
        tag_id: null
      },
      loading: false,
      any: new Date(),
      channels: [],
      users: []
    };
  },
  async created() {},
  mounted() {},
  computed: {
    sort() {
      return this.$route.query.sort;
    },
    hotType() {
      let sortArray = [
        "THREE_DAYS_HOTTEST",
        "WEEKLY_HOTTEST",
        "MONTHLY_HOTTEST",
        "HOTTEST"
      ];
      let that = this;
      let hot = sortArray.filter(r => {
        return r == this.$route.query.sort;
      });

      if (hot.length > 0) {
        return "primary";
      } else {
        return "info";
      }
    },
    channel() {
      return this.$route.params.channel;
    },
    tag_name() {
      return this.$route.params.tag_name;
    },
    latestArticle() {
      return this.getSortUrl("CreateTime");
    },
    threeDaysHottest() {
      return this.getSortUrl("THREE_DAYS_HOTTEST");
    }
  },
  watch: {
    $route(v) {
      console.log(v);
      this.refresh();
    }
  },
  methods: {
    async refresh() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    setPaginationParams() {
      //看起来很复杂，其实就是根据channels，得到选中的channelId值（技术频道），从channel.tags中找到对应的tagid（标签Id）值。
      if (this.channel != undefined) {
        this.channels &&
          this.channels.forEach(element => {
            if (this.channel == element.channel_code) {
              this.pagination.channel_id = element.id;
              if (this.tag_name != undefined) {
                element.tags.forEach(tag => {
                  if (tag.tag_name == this.tag_name) {
                    this.pagination.tag_id = tag.id;
                    return false;
                  }
                });
              } else {
                this.pagination.tag_id = null;
              }
              return false;
            }
          });
      } else {
        this.pagination.channel_id = null;
      }
    },
    async infiniteHandler($state) {
      await this.getNavChannels();
      this.setPaginationParams();
      let res;
      const currentPage = this.pagination.currentPage;
      res = await articleApi.getQueryArticles({
        count: this.pagination.pageSize,
        page: currentPage,
        sort: this.sort,
        channel_id: this.pagination.channel_id,
        tag_id: this.pagination.tag_id
      });
      let items = [...res.items];

      if (items.length == 0) {
        if (currentPage == 0) {
          this.dataSource = items;
        }
        $state && $state.complete();
      } else {
        if (currentPage == 0) {
          this.dataSource = items;
        } else {
          this.dataSource = this.dataSource.concat(items);
        }
        this.pagination.currentPage += 1;
        this.pagination.pageTotal = res.total;

        $state && $state.loaded();
      }
    },
    getSortUrl(val) {
      let url = "";
      if (this.channel && this.tag_name) {
        url = `/index/${this.channel}/${this.tag_name}?sort=${val}`;
      } else if (this.channel) {
        url = `/index/${this.channel}?sort=${val}`;
      } else {
        url = `/index?sort=${val}`;
      }
      return url;
    },
    onChange(val) {
      this.$router.push(this.getSortUrl(val));
    },
    async getNavChannels() {
      if (this.channels.length > 0) return;
      let res = await channelApi.getNavChannels({
        count: 20,
        page: 0
      });
      this.channels = res.items;
    }
  }
};
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0px !important;
}

.nav-list {
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  line-height: 1;
  .nav-item {
    height: 100%;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 1.16rem;
    color: #71777c;
    padding: 0 0.5rem;
  }
}

.lin-card {
  margin-bottom: 10px;
  border-radius: 8px;
  .lin-title {
    margin-bottom: 1rem;
    padding: 0 0 0 0.5rem;
    color: #000;
    border-left: 4px solid #ec7259;
  }
}

@media (max-width: 980px) {
  .nav-list {
    max-width: 960px;
    width: auto;
  }
}
</style>
