<template>
  <el-card
    class="info-box"
    shadow="hover"
    :body-style="{
                'width':' 100%',
                'background-color': '#fff',
                'border': '1px solid #f1f1f1',
                'transition': 'border-color .3s',
                'padding': '1.5rem 0'}"
  >
    <div class="tag">
      <router-link :to="{path:'/tag/'+`${id}`}" target="_blank">
        <div class="thumb" :style="`background-image:url(${thumbnail_display_url})`"></div>
        <div class="title">{{tag_name}}</div>
      </router-link>
      <div class="bottom clearfix" style="margin-top:10px;">
        <div class="meta-box">
          <time class="meta subscribe">{{subscribers_count}} 关注</time>
          •
          <time class="meta">{{article_count}} 随笔</time>
          <span class="meta-hidden">
            •
            <time class="meta">{{view_hits}} 浏览</time>
          </span>
        </div>
        <el-button
          type="primary"
          class="button"
          icon=""
          v-if="is_subscribe"
          @click="deleteSubscribeTag"
          size="small"
        >已关注</el-button>
        <el-button
          type="plain"
          class="button"
          icon=""
          v-else
          size="small"
          @click="addSubscribeTag"
        >关注</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import userTagApi from "@/model/user-tag";
export default {
  name: "TagItem",
  data() {
    return {};
  },
  props: {
    index: Number,
    id: String,
    tag_name: String,
    thumbnail_display: String,
    article_count: Number,
    is_subscribe: Boolean,
    subscribers_count: Number,
    view_hits: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  created() {},
  computed: {
    thumbnail_display_url() {
      if (this.status == true) {
        return this.thumbnail_display;
      } else {
        return "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png";
      }
    }
  },
  methods: {
    async addSubscribeTag() {
      await userTagApi.addSubscribeTag({
        tagId: this.id
      });
      this.$emit("addSubscribeTag", this.index);
    },
    async deleteSubscribeTag() {
      await userTagApi.deleteSubscribeTag({
        tagId: this.id
      });
      this.$emit("deleteSubscribeTag", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.info-box {
  margin-bottom: 20px;
  border-radius: 8px;
  .tag {
    width: 100%;
    text-align: center;
    .image {
      .title {
        font-size: 1.2rem;
        line-height: 1.7rem;
        color: #333;
      }
      .image-slot .el-icon-picture-outline {
        font-size: 2rem;
      }
    }

    .meta-box {
      justify-content: center;
      align-items: center;
      font-size: 0.85rem;
      color: #909090;

      .meta {
        line-height: 2rem;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
      }

      .article {
        margin-left: 0.8rem;
      }
    }
    :deep(.el-button--small) {
      .iconfont {
        font-size: 12px;
        margin-right: 3px;
      }
    }
    .thumb {
      background-size: contain;
      width: 100%;
      height: 32px;
      margin: 1rem auto;
      background-color: #fff;
      background-position: 50%;
      background-repeat: no-repeat;
      position: relative;
    }
    .thumb::before {
      opacity: 0;
      pointer-events: none;
    }
  }
}

@media (max-width: 960px) {
  .meta-box .meta-hidden {
    display: none !important;
  }
}
</style>
