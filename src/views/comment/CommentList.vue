<template>
  <div class="container">
    <div :gutter="20">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <comment-input @success="getComments" :form="form"></comment-input>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <el-card>
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
            :author="comment.user_info.nickname"
            :content="comment.text"
            :time="comment.create_time|filterTimeYmdHms"
            :hasReply="comment.top_comment && comment.top_comment.length > 0"
            :replyVisible="comment.replyVisible"
            @clickAvatar="handleClickAvatar(comment)"
            @clickAuthor="handleClickAuthor(comment)"
            @addReply="handleAddReply(comment,index)"
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
              @success="getComments"
              :form="{
                subject_id:form.subject_id,
                resp_id: comment.id,
                root_comment_id: comment.id,
                resp_user_id: comment.user_info.id
            }"
            ></comment-input>
            <reply-item
              slot="reply-list"
              v-for="(reply,i) in comment.top_comment"
              :avatar="reply.user_info.avatar"
              :key="reply.id"
              :author="reply.user_info.nickname"
              :content="reply.text"
              :time="reply.create_time|filterTimeYmdHms"
              @clickTool="($event, item)=>handleClickReplyTool(item,reply,index,i)"
              @addReply="handleAddCommentReply(reply,index,i)"
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
                @success="()=>getTopComments(reply,index)"
                :form="{
                subject_id:form.subject_id,
                resp_id: reply.id,
                root_comment_id: reply.root_comment_id,
                resp_user_id: reply.user_info.id
            }"
              ></comment-input>
            </reply-item>
          </comment-item>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script>
import commentApi from "@/models/comment";
import CommentItem from "@/views/comment/CommentItem";
import ReplyItem from "@/views/comment/ReplyItem";
import userLike from "@/models/userLike";
import CommentInput from "@/views/comment/CommentInput";

export default {
  name: "CommentList",
  components: { CommentItem, ReplyItem, CommentInput },
  data() {
    return {
      comments: [],
      form: {
        subject_id: "5dc93286-5e44-c190-008e-3fc74d4fcee0",
        resp_id: null,
        root_comment_id: null,
        resp_user_id: null
      }
    };
  },
  async created() {
    await this.getComments();
  },
  methods: {
    async getComments() {
      let comments = await commentApi.getComments({
        article_id: "5dc93286-5e44-c190-008e-3fc74d4fcee0"
      });
      comments.items.forEach(item => {
        item.replyVisible = false;
        item.top_comment.forEach(val => {
          val.replyVisible = false;
        });
      });
      this.comments = comments.items;
    },
    async getTopComments(reply, index) {
      let comments = await commentApi.getComments({
        article_id: "5dc93286-5e44-c190-008e-3fc74d4fcee0",
        root_comment_id: reply.root_comment_id
      });
      comments.items.forEach(item => {
        item.replyVisible = false;
      });
      this.comments[index].top_comment = comments.items;
    },
    handleClickAvatar() {},
    handleClickAuthor() {},
    handleAddReply(comment, index) {
      this.comments[index].replyVisible = !comment.replyVisible;
    },
    handleAddCommentReply(reply, index, i) {
      this.comments[index].top_comment[i].replyVisible = !reply.replyVisible;
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