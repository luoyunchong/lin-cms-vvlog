<template>
  <div class="container">
    <div :gutter="20">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <el-form ref="form" :model="form" label-width="80px" label-position="top" :rules="rules">
          <el-form-item label="评论内容" prop="text">
            <el-input type="textarea" placeholder="请输入评论内容" v-model="form.text"></el-input>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-badge :value="500" class="item">剩余字数</el-badge>
            <el-button type="primary" @click="addComment">评论</el-button>
          </el-form-item>
        </el-form>

        <el-card>
          <comment-item
            v-for="(comment,index) in comments"
            :key="comment.id"
            :avatar="comment.user_info.avatar"
            :author="comment.user_info.nickname"
            :content="comment.text"
            :time="comment.create_time|filterTimeYmdHms"
            :hasReply="replys && replys.length > 0"
            @clickAvatar="handleClickAvatar(comment)"
            @clickAuthor="handleClickAuthor(comment)"
            @addReply="handleAddReply(comment)"
            :ops="[
                {
                  count:comment.likes_quantity,
                  name:'点赞',
                  icon:'iconfont icon-'+(comment.is_liked?'like-fill':'like'),
                  click:()=>handleLike(comment,index)
                }
            ]"
          >
            <reply-item
              v-for="reply in comment.top_comment"
              :avatar="reply.user_info.avatar"
              :key="reply.id"
              :author="reply.user_info.nickname"
              :content="reply.text"
              :time="reply.create_time|filterTimeYmdHms"
            ></reply-item>
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

export default {
  name: "CommentList",
  components: { CommentItem, ReplyItem },
  data() {
    return {
      comments: [],
      replys: [],
      form: {
        subject_id: "5dc93286-5e44-c190-008e-3fc74d4fcee0",
        resp_id: null,
        text: ""
      },
      rules: {
        au_name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        au_email: [{ required: true, message: "请输入邮件", trigger: "blur" }],
        text: [
          {
            required: true,
            message: "请输入评论内容",
            trigger: "blur"
          }
        ]
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
      this.comments = comments.items;
      this.replys = comments.items;
    },
    addComment() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let res = await commentApi.addComment(this.form);
          this.$message.success(`${res.msg}`);
          this.getComments();
          this.$refs["form"].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClickAvatar() {},
    handleClickAuthor() {},
    handleAddReply() {},
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
    }
  }
};
</script>

<style>
</style>