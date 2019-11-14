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
    <div class="width:100%;text-align:center;">
      <img :src="thumbnail_display" class="image" />
    </div>
    <div style="padding: 14px;text-align:center;">
      <span class="title">{{tag_name}}</span>
      <div class="bottom clearfix" style="margin-top:10px;">
        <div class="meta-box">
          <time class="meta subscribe">397398 关注</time>
          <time class="meta article">37335 文章</time>
        </div>
        <el-button type="primary" class="button" icon="iconfont icon-heart-fill">已关注</el-button>
        <el-button type="plain" class="button" icon="iconfont icon-heart">关注</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "TagItem",
  data() {
    return {
      alias: "",
      create_time: 1573521607710,
      create_user_id: 7,
      id: "5dca7947-3e28-1460-0026-4835799a9601",
      tag_name: "测试",
      thumbnail_display:
        "https://localhost:5001/assets/2019/11/12/82f53f1c-8ffe-4f8f-ab6d-6002a54cea5a.jpg"
    };
  },
  props: {
    // id: String,
    // tag_name: String,
    // thumbnail: String,
    // thumbnail_display: String
  },
  created() {},
  methods: {}
};
</script>


<style lang="scss" scoped>
.info-box {
  margin-bottom: 20px;
  .image {
    width: 32px;
    height: 32px;
    margin: 10px auto;
  }
  .title {
    font-size: 1.2rem;
    line-height: 1.7rem;
    color: #333;
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