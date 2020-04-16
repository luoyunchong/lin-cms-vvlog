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
            <MarkdownPro
              v-model="form.content"
              :bordered="true"
              :height="800"
              theme="oneDark"
              @on-save="handleOnSave"
              :autoSave="true"
            />
          </el-col>
          <!-- <el-col :lg="6">
          <div style="line-height:55px;height:55px;margin-left:10px;">
            <el-button type="primary" @click="confirmEdit('form')" icon="el-icon-edit" plain>发布随笔</el-button>
          </div>
          </el-col>-->
        </el-row>
      </el-form>
      <div class="markdown"></div>
      <editor-dialog ref="editorDialog" :id="id" :content="form.content" :title="form.title"></editor-dialog>
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
        let res = await articleApi.getArticleDraft(this.id).finally(() => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.content = "";
    },
    async handleOnSave({ value, theme }) {
      if (this.id == 0 || this.form.title == "" || value == "") return;
      await articleApi.editArticleDraft(this.id, {
        title: this.form.title,
        content: value
      });
      console.log("自动保存");
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
