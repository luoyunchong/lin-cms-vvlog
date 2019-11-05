<template>
  <div class="a-tools action-box">
    <div class="a-badge" title="点赞">
      <a @click="handleStar">
        <el-badge :value="model.starCount" :type="model.isStared==1?'danger':'info'">
          <el-avatar
            :size="32"
            icon="iconfont icon-like"
            class="a-avatar"
            :style="model.isStared==1?'color: #f56a00; background-color: #fde3cf':''"
          />
        </el-badge>
      </a>
    </div>
    <div class="a-badge" title="评论">
      <a>
        <el-badge :type="model.isComment==1?'danger':'info'" :value="model.commentCount">
          <el-avatar
            :size="32"
            icon="el-icon-chat-dot-square"
            class="a-avatar"
            :style="model.isComment==1?'color: #f56a00; background-color: #fde3cf':''"
          />
        </el-badge>
      </a>
    </div>
    <div class="a-badge" title="收藏">
      <a @click="handleCollect">
        <el-badge :type="model.isCollect==1?'danger':'info'" :value="model.collectCount">
          <el-avatar
            :size="32"
            icon="el-icon-collection"
            class="a-avatar"
            :style="model.isCollect==1?'color: #f56a00; background-color: #fde3cf':''"
          />
        </el-badge>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        id: 0,
        isStared: 0,
        starCount: 0,
        isComment: 0,
        commentCount: 0,
        isCollect: 0,
        collectCount: 0
      }
    };
  },
  props: {
    // model: {
    //   type: Object,
    //   default() {
    //     return {
    //       id: 0,
    //       isStared: 0,
    //       starCount: 0,
    //       isComment: 0,
    //       commentCount: 0,
    //       isCollect: 0,
    //       collectCount: 0
    //     };
    //   }
    // }
  },
  computed: {},
  created() {},
  methods: {
    handleStar() {
      console.log("handleStar");
      if (this.model.isStared == 1) {
        this.model.isStared = 0;
        this.model.starCount -= 1;
      } else {
        this.model.isStared = 1;
        this.model.starCount += 1;
      }
    },
    handleCollect() {
      console.log("handleCollect");

      if (this.model.isCollect == 1) {
        this.model.isCollect = 0;
        this.model.collectCount -= 1;
      } else {
        this.model.isCollect = 1;
        this.model.collectCount += 1;
      }
    }
  }
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
  .ant-divider {
    display: none;
  }
}

.mobile {
  .a-tools {
    display: block;
    position: fixed;
    z-index: 1;
    bottom: 0;
    width: 100%;
    margin-left: 0px;
    top: inherit;
    .a-badge {
      cursor: pointer;
      margin-bottom: 0rem;
    }
    .ant-divider {
      display: inherit;
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