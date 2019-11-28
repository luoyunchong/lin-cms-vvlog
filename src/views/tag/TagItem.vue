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
      <a :href="`/tag/${id}`" target="_blank">
        <div class="thumb" :style="`background-image:url(${thumbnail_display})`"></div>
        <!-- <el-image :src="thumbnail_display" class="image">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>-->
        <div class="title">{{tag_name}}</div>
      </a>
      <div class="bottom clearfix" style="margin-top:10px;">
        <div class="meta-box">
          <!-- <time class="meta subscribe">397398 关注</time> -->
          <time class="meta">{{article_count}} 随笔</time>
          <!-- article -->
        </div>
        <!-- <el-button type="primary" class="button" icon="iconfont icon-heart-fill">已关注</el-button>
        <el-button type="plain" class="button" icon="iconfont icon-heart">关注</el-button>-->
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "TagItem",
  data() {
    return {};
  },
  props: {
    id: String,
    tag_name: String,
    thumbnail_display: String,
    article_count: Number
  },
  created() {},
  methods: {}
};
</script>


<style lang="scss" scoped>
.info-box {
  margin-bottom: 20px;
  .tag {
    width: 100%;
    text-align: center;
    .image {
      // width: 32px;
      // height: 32px;
      // margin: 10px auto;
      .title {
        font-size: 1.2rem;
        line-height: 1.7rem;
        color: #333;
      }
      .image-slot .el-icon-picture-outline {
        font-size: 2rem;
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
.meta-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #909090;
  .meta {
    line-height: 2rem;
  }
  .article {
    margin-left: 0.8rem;
  }
}
</style>