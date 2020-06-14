<template>
  <div>
    <el-form ref="form" :rules="rules" :model="model">
      <el-form-item prop="text">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入评论内容"
          v-model="model.text"
          minlength="1"
          :maxlength="surplus"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item style="text-align:right;">
        <el-button type="primary" @click="addComment" :disabled="model.text==''">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import commentApi from "@/model/comment";
export default {
  name: "CommentInput",
  props: {
    form: {
      type: Object,
      default() {
        return {
          subject_id: "",
          subject_type: 1,
          resp_id: null,
          text: "",
          root_comment_id: null,
          resp_user_id: null
        };
      }
    }
  },
  data() {
    return {
      disabled: true,
      surplus: 500,
      model: {
        text: ""
      },
      rules: {
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
  created() {},
  computed: {},
  methods: {
    addComment() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let text = this.model.text.trim();
          if (text == "") {
            this.$message({
              message: "发布内容为空!",
              type: "warning"
            });
            return;
          }

          let res = await commentApi.addComment(
            Object.assign(this.form, { text: text })
          );
          this.$message.success(`${res.message}`);
          this.$emit("success");
          this.$refs["form"].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 1px !important;
  /deep/ .el-form-item__content {
    line-height: 20px;
    margin-bottom: 10px;
  }
}
</style>