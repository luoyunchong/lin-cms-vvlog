<template>
  <div>
    <head-nav @confirmEdit="confirmEdit"></head-nav>
    <div class="editor-container">
      <el-form
        class="editor-form"
        :rules="rules"
        :model="form"
        status-icon
        ref="form"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row>
          <el-col :lg="24" class="margin-bottom">
            <el-input
              class="editor-title"
              size="medium"
              v-model="form.title"
              placeholder="请填写随笔标题"
              style="font-size:1.4rem;"
            ></el-input>
          </el-col>
          <el-col :lg="24">
            <MarkdownPro v-model="form.content" :bordered="true" :height="800" theme="oneDark" />
          </el-col>
          <!-- <el-col :lg="6">
          <div style="line-height:55px;height:55px;margin-left:10px;">
            <el-button type="primary" @click="confirmEdit('form')" icon="el-icon-edit" plain>发布随笔</el-button>
          </div>
          </el-col>-->
        </el-row>
      </el-form>
      <div class="markdown"></div>
      <editor-dialog ref="editorDialog" :id="id" @submit="submitForm"></editor-dialog>
    </div>
  </div>
</template>
<script>
import EditorDialog from "./EditorDialog";
import HeadNav from "./HeadNav";
import articleApi from "@/models/article";
import { User as CurrentUser } from "@/components/layout";
import { MarkdownPro } from "vue-meditor";
export default {
  name: "EditorForm",
  data() {
    return {
      form: {
        content: "",
        title: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  components: {
    EditorDialog,
    CurrentUser,
    HeadNav,
    MarkdownPro
  },
  async mounted() {
    this.show();
  },
  async created() {},
  watch: {
    $route(to, from) {
      this.show();
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    async show() {
      if (this.id != 0) {
        this.loading = true;
        let res = await articleApi.getArticle(this.id).finally(() => {
          this.loading = false;
        });
        this.form = {
          title: res.title,
          content: res.content
        };
      } else {
        this.resetForm("form");
      }
    },
    async confirmEdit() {
      this.$refs["editorDialog"].show();
    },
    async submitForm(formDialogData) {
      let formData = Object.assign(formDialogData, this.form);
      if (this.id != 0) {
        await articleApi.editArticle(this.id, formData);
      } else {
        await articleApi.addArticle(formData);
      }
      this.$message.success(`发布成功!`);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.content = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";

.editor-container {
  margin-top: 80px;
  width: 100%;
  height: 100%;
  .editor-form {
    width: 80%;
    margin: 20px auto;
    max-width: 1440px;
  }
  .editor-title /deep/ .el-input__inner {
    height: 45px;
    line-height: 45px;
  }
  .header-container {
    width: 100px;
  }
}

@media (max-width: 960px) {
  .editor-container {
    .editor-form {
      width: 100%;
      margin: auto;
      max-width: 1440px;
    }
  }
}
</style>
