<template>
  <div class="article">
    <div class="article-list">
      <div class="article-item" v-for="item in dataSource" v-bind:key="item.id">
        <div class="article-list-item-extra-wrap">
          <div class="article-detail">
            <div class="info-row">
              <ul class="meta-list">
                <li class="item clickable">
                  <el-tag type="success" v-if="item.article_type==0">原创</el-tag>
                  <el-tag type="info" v-else-if="item.article_type==1">转载</el-tag>
                  <el-tag type="danger" v-else-if="item.article_type==2">翻译</el-tag>
                </li>
                <li class="item username clickable">
                  <a :href="`/user/${item.user_info.id}/article`">{{item.user_info.nickname}}</a>
                </li>
                <li class="item">{{item.time_span}}</li>
                <li class="item" v-for="(tag,index) in item.tags" v-bind:key="index">
                  <a :href="'/tag/'+tag.id" class="tag" target="_blank">{{tag.tag_name}}</a>
                </li>
              </ul>
            </div>
            <div class="info-row title-row">
              <!-- 需要注意这里加/# -->
              <router-link
                class="article-detail-title"
                :to="{ name: 'post', params: { id: item.id }}"
              >{{item.title}}</router-link>
              <!-- <a class="article-detail-title" @click="()=>toArticle(item)">{{item.title}}</a> -->
            </div>
            <div class="info-row article-detail-content">{{item.excerpt}}</div>
            <div class="info-row">
              <div class="article-tool">
                <ul class="article-about">
                  <li>
                    <router-link
                      class="article-detail-title"
                      :to="{ name: 'post', params: { id: item.id }}"
                    >
                      <l-icon name="like-fill" v-if="item.is_liked==true" color="#7fccde"></l-icon>
                      <l-icon name="like" v-else color="#b2bac2"></l-icon>
                      <!-- <i class="el-icon-star-off"></i> -->
                      <span class="count">{{item.likes_quantity}}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      class="article-detail-title"
                      :to="{path:'/post/'+item.id+'#comment-list'}"
                    >
                      <l-icon name="comment" color="#b2bac2"></l-icon>
                      <!-- <i class="el-icon-s-comment"></i> -->
                      <span class="count">{{item.comment_quantity}}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      class="article-detail-title"
                      :to="{ name: 'post', params: { id: item.id }}"
                    >
                      <l-icon name="eye" color="#b2bac2"></l-icon>
                      <!-- <i class="iconfont icon-fenxiang"></i> -->
                      <!-- <i class="el-icon-view"></i> -->
                      <span class="count">{{item.view_hits}}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <img class="article-thumb" :src="item.thumbnail_display" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleList",
  data() {
    return {};
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  mounted() {},
  methods: {
    toArticle(item) {
      this.$router.push({ name: "p", params: { id: item.id } });
    }
  }
};
</script>

<style scoped lang="scss">
.article {
  flex: 1;
  padding: 20px 5px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
  border-radius: 8px;
  .article-list {
    // cursor: pointer;
    .article-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      padding: 1.5rem 2rem;
      .article-list-item-extra-wrap {
        display: flex;
        align-items: center;
        width: 100%;
        .article-thumb {
          flex: 0 0 auto;
          margin-left: 2rem;
          background-color: #fff;
          cursor: pointer;
          width: 150px;
          height: 100px;
          border-radius: 8px;
          margin-right: 30px;
          object-fit: cover;
        }
        .article-detail {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          .article-detail-title {
            cursor: pointer;
            height: 22px;
            font-size: 18px;
            font-weight: 600;
            color: rgba(69, 82, 107, 1);
            line-height: 22px;
          }
          .article-detail-title:hover {
            text-decoration: underline;
          }
          .article-detail-content {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(140, 152, 174, 1);
            line-height: 22px;
          }
        }
        .title-row {
          margin: 0.5rem 0 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-size: 12px;
          line-height: 17px;
          color: #808da3;
          .meta-list {
            display: flex;
            align-items: baseline;
            white-space: nowrap;
            .item.clickable:hover {
              color: #007fff;
            }
            .item.username {
              display: flex;
              align-items: baseline;
            }
            .item:not(:last-child)::after {
              content: "·";
              color: rgb(178, 186, 194);
              margin: 0px 0.4em;
            }
            .item a.tag:not(:last-child):after {
              content: "/";
              margin: 0 0.2em;
              color: #b2bac2;
            }
            .item .tag:hover {
              color: #007fff;
            }
          }

          .article-tool {
            ul.article-about {
              display: inline-flex;
              white-space: nowrap;
              li {
                height: 1.8rem;
                font-size: 1.083rem;
                line-height: 1;
                white-space: nowrap;
                color: #b2bac2;
                border-radius: 1px;
                border: 1px solid #edeeef;
                cursor: pointer;
                a {
                  display: flex;
                  align-items: center;
                  padding: 0 0.8rem;
                  height: 100%;
                  color: inherit;
                  .count {
                    color: #b2bac2;
                    margin-left: 0.2em;
                  }
                }
              }
              li:hover {
                background-color: #f7f8fa;
              }
              .iconfont {
                margin-right: 0.2em;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 600px) {
  .article-thumb {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .quantity-statistics .quantity-item {
    width: 32%;
    &:last-child {
      display: none;
    }
  }
  .container .information .personal {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}
</style>
