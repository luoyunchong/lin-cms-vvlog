<template>
  <div class="a-tools action-box">
    <div class="a-badge" title="点赞">
      <a @click="handleLike">
        <el-badge :value="model.likes_quantity" :type="model.is_liked ? 'danger' : 'info'">
          <el-avatar :size="32" class="a-avatar"
            :style="model.is_liked ? 'color: #f56a00; background-color: #fde3cf' : ''">
            <IconAntDesignLikeFilled />
          </el-avatar>
        </el-badge>
        <el-icon size="22" color="#000"> </el-icon>
      </a>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="a-badge" title="评论">
      <a :href="`#/p/${model.id}#comment-list`">
        <el-badge :type="model.is_comment ? 'danger' : 'info'" :value="model.comment_quantity">
          <el-avatar :size="32" class="a-avatar"
            :style="model.is_comment ? 'color: #f56a00; background-color: #fde3cf' : ''">
            <IconAntDesignCommentOutlined />
          </el-avatar>
        </el-badge>
      </a>
    </div>
    <!-- <el-divider direction="vertical"></el-divider>
    <div class="a-badge" title="收藏">
      <a @click="handleCollect">
        <el-badge :type="model.is_collect?'danger':'info'" :value="model.collect_quantity">
          <el-avatar
            :size="32"
            icon="el-icon-collection"
            class="a-avatar"
            :style="model.is_collect?'color: #f56a00; background-color: #fde3cf':''"
          />
        </el-badge>
      </a>
    </div>-->
  </div>
</template>

<script>
import userLike from "@/model/user-like";
import IconAntDesignLikeFilled from "~icons/ant-design/like-filled";
import IconAntDesignCommentOutlined from "~icons/ant-design/comment-outlined";

export default {
  data() {
    return {};
  },
  components: { IconAntDesignLikeFilled, IconAntDesignCommentOutlined },
  props: {
    model: {
      type: Object,
      default() {
        return {
          id: 0,
          is_liked: false,
          likes_quantity: 0,
          is_comment: false,
          comment_quantity: 0,
          is_collect: false,
          collect_quantity: 0,
        };
      },
    },
  },
  computed: {},
  created() { },
  methods: {
    async handleLike() {
      let res = await userLike.likeOrCancel({
        subject_id: this.model.id,
        subject_type: 1,
      });
      this.$message.success(`${res.message}`);
      if (this.model.is_liked) {
        this.$emit("likeChange", { likes_quantity: -1, is_liked: false });
      } else {
        this.$emit("likeChange", { likes_quantity: 1, is_liked: true });
      }
    },
    handleCollect() {
      console.log("");

      if (this.model.isCollect) {
        this.model.isCollect = 0;
        this.model.collectCount -= 1;
      } else {
        this.model.isCollect = 1;
        this.model.collectCount += 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.a-tools {
  position: fixed;
  margin-left: -4rem;
  top: 15rem;

  .a-badge {
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .el-divider {
    display: none;
  }
}

@media (max-width: 960px) {
  .a-tools {
    display: block;
    position: fixed;
    z-index: 1501;
    bottom: 0;
    width: 100%;
    margin-left: 0px;
    top: inherit;

    .a-badge {
      cursor: pointer;
      margin-bottom: 0rem;
    }

    .el-divider {
      display: inherit;
      height: 1.92rem;
      margin-top: 10px;
    }
  }

  .action-box {
    display: flex;
    height: 3.92rem;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    background: #fff;

    .a-badge {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-divider-vertical {
      top: 0.8em;
      width: 1px;
      height: 2.9em;
      margin: 0 8px;
    }
  }
}
</style>
