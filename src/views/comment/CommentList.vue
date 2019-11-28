<template>
  <div
    style="position: relative;
      padding-top: 50px;
      margin-top: -50px;
      margin-bottom:50px;
    }"
  >
    <el-card
      shadow="never"
      :body-style="{'padding-bottom':'0px'}"
      style="margin-bottom:20px;margin-top:20px;"
    >
      <comment-input
        @success="getComments"
        :form="{
                subject_id:subject_id,
                subject_type:subject_type,
                resp_id: null,
                root_comment_id: null,
                resp_user_id: null
            }"
      ></comment-input>
    </el-card>
    <el-card shadow="never">
      <!-- :ops="[
                {
                  count:comment.likes_quantity,
                  name:'点赞',
                  icon:'iconfont icon-'+(comment.is_liked?'like-fill':'like'),
                  click:()=>handleLike(comment,index)
                }
      ]"-->
      <comment-item
        v-for="(comment,index) in comments"
        :key="comment.id"
        :avatar="comment.user_info.avatar"
        :author="comment.user_info"
        :content="comment.text"
        :time="comment.create_time|filterTimeYmdHms"
        :hasReply="comment.top_comment && comment.top_comment.length > 0"
        :replyVisible="comment.replyVisible"
        @clickAvatar="handleClickAvatar(comment)"
        @clickAuthor="handleClickAuthor(comment)"
        @addReply="handleAddReply(comment,index)"
        @deleteReply="handleDeleteReply(comment,index)"
        @clickTool="($event, item)=>handleClickTool(item,comment,index)"
        :tools="[
                {
                  text:comment.likes_quantity,
                  title:'点赞',
                  name:'like',
                  icon:'iconfont icon-'+(comment.is_liked?'like-fill':'like'),
                }
            ]"
      >
        <comment-input
          slot="comment-input"
          @success="()=>getTopComments(comment.id,index)"
          :form="{
                subject_id:subject_id,
                subject_type:subject_type,
                resp_id: comment.id,
                root_comment_id: comment.id,
                resp_user_id: comment.user_info.id
            }"
        ></comment-input>
        <reply-item
          slot="reply-list"
          v-for="(reply,i) in comment.top_comment"
          :key="reply.id"
          :author="reply.user_info"
          :resp_user_info="reply.resp_user_info"
          :content="reply.text"
          :time="reply.create_time|filterTimeYmdHms"
          @clickTool="($event, item)=>handleClickReplyTool(item,reply,index,i)"
          @addReply="handleAddCommentReply(reply,index,i)"
          @deleteReply="handleDeleteCommentReply(reply,index,i)"
          :replyVisible="reply.replyVisible"
          :tools="[
                {
                  text:reply.likes_quantity,
                  title:'点赞',
                  name:'like',
                  icon:'iconfont icon-'+(reply.is_liked?'like-fill':'like'),
                }
            ]"
        >
          <comment-input
            slot="reply-item-input"
            @success="()=>getTopComments(reply.root_comment_id,index)"
            :form="{
                subject_id:subject_id,
                subject_type:subject_type,
                resp_id: reply.id,
                root_comment_id: reply.root_comment_id,
                resp_user_id: reply.user_info.id
            }"
          ></comment-input>
        </reply-item>
      </comment-item>

      <infinite-loading @infinite="infiniteHandler" spinner="bubbles" :identifier="any">
        <span slot="no-more">
          <el-divider>我也是有底线的...</el-divider>
        </span>
        <span slot="no-results">
          <el-divider>还没有人来评论...</el-divider>
        </span>
      </infinite-loading>
    </el-card>
  </div>
</template>

<script>
import commentApi from "@/models/comment";
import CommentItem from "@/views/comment/CommentItem";
import ReplyItem from "@/views/comment/ReplyItem";
import userLike from "@/models/userLike";
import CommentInput from "@/views/comment/CommentInput";

import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "CommentList",
  components: { CommentItem, ReplyItem, CommentInput, InfiniteLoading },
  data() {
    return {
      comments: [],
      form: {
        resp_id: null,
        root_comment_id: null,
        resp_user_id: null
      },
      pagination: {
        currentPage: 0,
        pageSize: 10,
        pageTotal: 0
      },
      any: "any" + new Date()
    };
  },
  props: {
    subject_id: {
      type: String,
      default: "5dc93286-5e44-c190-008e-3fc74d4fcee1"
    },
    subject_type: {
      type: Number,
      default: 1
    }
  },
  computed: {},
  async created() {},
  methods: {
    async getComments() {
      this.pagination.currentPage = 0;
      this.any = new Date();
      await this.infiniteHandler();
    },
    async infiniteHandler($state) {
      console.log($state);
      const currentPage = this.pagination.currentPage;
      let res = await commentApi.getPublicComments({
        subject_id: this.subject_id,
        count: this.pagination.pageSize,
        page: currentPage
      });
      res.items.forEach(item => {
        item.replyVisible = false;
        item.top_comment.forEach(val => {
          val.replyVisible = false;
        });
      });
      if (res.items.length == 0) {
        $state && $state.complete();
        if (currentPage == 0) {
          this.comments = res.items;
          this.pagination.currentPage += 1;
          this.pagination.pageTotal = res.total;
        }
      } else {
        if (currentPage == 0) {
          this.comments = res.items;
        } else {
          this.comments = this.comments.concat(res.items);
        }

        this.pagination.currentPage += 1;
        this.pagination.pageTotal = res.total;

        $state && $state.loaded();
      }
      this.$emit("success", res.total);
    },
    async getTopComments(root_comment_id, index) {
      let res = await commentApi.getPublicComments({
        subject_id: this.subject_id,
        root_comment_id: root_comment_id
      });
      res.items.forEach(item => {
        item.replyVisible = false;
      });
      this.comments[index].top_comment = res.items;

      this.$emit("success", res.total);
    },
    handleClickAvatar() {},
    handleClickAuthor() {},
    handleAddReply(comment, index) {
      this.comments[index].replyVisible = !comment.replyVisible;
    },
    handleAddCommentReply(reply, index, i) {
      this.comments[index].top_comment[i].replyVisible = !reply.replyVisible;
    },
    async handleDeleteReply(comment, index) {
      await commentApi.delectComment(comment.id);
      this.getComments();
    },
    async handleDeleteCommentReply(reply, index, i) {
      let res = await commentApi.delectComment(reply.id);
      this.$message.success(`${res.msg}`);
      await this.getTopComments(reply.root_comment_id, index);
    },
    async handleClickTool(item, comment, index) {
      if (item.name == "like") {
        await this.handleLike(comment, index);
      }
    },
    async handleClickReplyTool(item, reply, index, i) {
      if (item.name == "like") {
        await this.handleReplyLike(reply, index, i);
      }
    },
    async handleLike(comment, index) {
      let res = await userLike.likeOrCancel({
        subject_id: comment.id,
        subject_type: 2
      });
      this.$message.success(`${res.msg}`);
      if (this.comments[index].is_liked) {
        this.comments[index].is_liked = false;
        this.comments[index].likes_quantity -= 1;
      } else {
        this.comments[index].is_liked = true;
        this.comments[index].likes_quantity += 1;
      }
    },
    async handleReplyLike(reply, index, i) {
      let res = await userLike.likeOrCancel({
        subject_id: reply.id,
        subject_type: 2
      });
      this.$message.success(`${res.msg}`);
      if (this.comments[index].top_comment[i].is_liked) {
        this.comments[index].top_comment[i].is_liked = false;
        this.comments[index].top_comment[i].likes_quantity -= 1;
      } else {
        this.comments[index].top_comment[i].is_liked = true;
        this.comments[index].top_comment[i].likes_quantity += 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>