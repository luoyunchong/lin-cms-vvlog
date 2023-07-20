<template>
  <div class="article">
    <div class="article-list">
      <div class="article-item" v-for="item in dataSource" v-bind:key="item.id">
        <div class="article-list-item-extra-wrap">
          <div class="article-detail">
            <div class="info-row">
              <ul class="meta-list">
                <li class="item clickable">
                  <el-tag effect="light" v-if="item.article_type == 0">原</el-tag>
                  <el-tag type="success" effect="light" v-else-if="item.article_type == 1">转</el-tag>
                  <el-tag type="info" effect="light" v-else-if="item.article_type == 2">译</el-tag>
                </li>
                <li class="item username clickable" v-if="item.user_info != undefined">
                  <router-link :to="{
                    path: `/user/${item.user_info.id}/article`
                  }" target="_blank">{{ item.user_info.nickname }}</router-link>
                  <!-- <a :href="`/user/${item.user_info.id}/article`">{{item.user_info.nickname}}</a> -->
                </li>
                <li class="item">{{ item.time_span }}</li>
                <li class="item" v-for="(tag, index) in item.tags" v-bind:key="index">
                  <router-link :to="{ path: '/tag/' + `${tag.id}` }" class="tag" target="_blank">{{ tag.tag_name
                  }}</router-link>
                </li>
              </ul>
            </div>
            <div class="info-row title-row">
              <router-link target="_blank" class="article-detail-title" :to="{ name: 'p', params: { id: item.id } }">{{
                item.title }}</router-link>
            </div>
            <span class="info-row article-detail-content article-detail-ellpisis3">{{ item.excerpt }}</span>
            <div class="info-row">
              <div class="article-tool">
                <ul class="article-about">
                  <li>
                    <router-link class="article-detail-title" :to="{ name: 'p', params: { id: item.id } }"
                      target="_blank">
                      <l-icon name="like-fill" v-if="item.is_liked == true" color="#7fccde"></l-icon>
                      <l-icon name="like" v-else color="#b2bac2"></l-icon>
                      <!-- <i class="el-icon-star-off"></i> -->
                      <span class="count">{{ item.likes_quantity }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link class="article-detail-title" target="_blank"
                      :to="{ path: '/p/' + item.id + '#comment-list' }">
                      <l-icon name="comment" color="#b2bac2"></l-icon>
                      <!-- <i class="el-icon-s-comment"></i> -->
                      <span class="count">{{ item.comment_quantity }}</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link class="article-detail-title" target="_blank"
                      :to="{ name: 'p', params: { id: item.id } }">
                      <l-icon name="eye" color="#b2bac2"></l-icon>
                      <!-- <i class="el-icon-view"></i> -->
                      <span class="count">{{ item.view_hits }}</span>
                    </router-link>
                  </li>
                  <li v-if="showedit && item.user_info.id == this.user.id">
                    <el-dropdown size="large" >
                      <span class="el-dropdown-link">
                        {{ activeValue }}
                        <el-icon style="width:50px;height:36px;">
                          <More />
                        </el-icon>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="edit" @click="toArticle(item)">编辑</el-dropdown-item>
                          <el-dropdown-item command="delete" @click="deleteArticle(item)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <router-link target="_blank" :to="{ path: '/p/' + item.id }" v-if="item.thumbnail_display != ''">
            <img class="
            article-thumb" :src="item.thumbnail_display" />
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="dataSource.length == 0">
      <el-empty description="啥也没有" />
    </div>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';
import articleApi from '@/model/article'
export default {
  name: 'ArticleList',
  data() {
    return {};
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showedit:{
      type:Boolean,
      default:false
    }
  },
  mounted() { },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    toArticle(item) {
      window.open('/#/p/' + item.id)
    },
    async deleteArticle(model) {
      ElMessageBox.confirm(
        '删除随笔后不可恢复，确定删除吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await articleApi.deleteArticle(model.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.$emit('deleteArticle', model)
      })
    }
  },
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
          flex-direction: column;
          justify-content: center;
          min-width: 0;

          .article-detail-title {
            cursor: pointer;
            height: 22px;
            font-size: 18px;
            font-weight: 600;
            color: #45526b;
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

          .article-detail-ellpisis3 {
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .title-row {
          margin: 0.5rem 0 0.6rem;
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

            .item .el-tag {
              border-radius: 4px;
              padding: 0 5px;
            }

            .item.clickable:hover {
              color: #007fff;
            }

            .item.username {
              display: flex;
              align-items: baseline;
            }

            .item:not(:last-child)::after {
              content: '·';
              color: rgb(178, 186, 194);
              margin: 0px 0.4em;
            }

            .item a.tag:not(:last-child):after {
              content: '/';
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
