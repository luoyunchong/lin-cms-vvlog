<template>
  <div class="container">
    <div :gutter="20">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <!-- <el-form
          ref="form"
          :model="form"
          label-width="80px"
          label-position="top"
          :rules="rules"
          size="small">
          <el-form-item label="评论内容" prop="text">
            <el-input type="textarea" placeholder="请输入评论内容" v-model="form.text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addComment">评论</el-button>
          </el-form-item>
        </el-form>-->

        <el-card>
          <comment-item
            v-for="comment in comments"
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
                  name:'点赞',
                  icon:'iconfont icon-like',
                  click:()=>handleLike(comment.id)
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

import { async } from "q";
export default {
  name: "CommentList",
  components: { CommentItem, ReplyItem },
  data() {
    return {
      comments: [],
      replys: [],
      form: {
        article_id: "5dc6bb5f-9cfa-ff24-00a8-d50e576b275a",
        p_id: null,
        text: "",
        au_name: "",
        au_email: ""
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
        article_id: "5dc6bb5f-9cfa-ff24-00a8-d50e576b275a"
      });
      this.comments = comments.items;
      this.replys = comments.items;
    },
    addComment() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let res = await commentApi.addComment(this.form);
          this.$message.success(`${res.msg}`);
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
    handleLike(id) {
      console.log(id);
    }
  }
};
</script>

<style>
</style>