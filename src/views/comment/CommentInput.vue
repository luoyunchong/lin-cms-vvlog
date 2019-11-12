<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" label-position="top" :rules="rules">
      <el-form-item prop="text">
        <el-input type="textarea" :autosize="true" placeholder="请输入评论内容" v-model="form.text"></el-input>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-badge :value="500" style="margin-right:50px;">剩余字数</el-badge>
        <el-button type="primary" @click="addComment">评论</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import commentApi from "@/models/comment";
export default {
  name: "CommentInput",
  data() {
    return {
      form: {
        subject_id: "5dc93286-5e44-c190-008e-3fc74d4fcee0",
        resp_id: null,
        text: ""
      }
    };
  },
  created() {},
  computed: {},
  methods: {
    addComment() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let res = await commentApi.addComment(this.form);
          this.$message.success(`${res.msg}`);
          this.$refs["form"].resetFields();
          this.$emit("success");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
</style>