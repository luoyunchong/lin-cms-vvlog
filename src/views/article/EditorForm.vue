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
              v-if="form.editor==1"
              v-model="form.content"
              :bordered="true"
              :height="750"
              theme="oneDark"
              @on-save="handleOnSave"
              :autoSave="true"
            />
            <tinymce
              v-else
              :height="750"
              v-model="form.content"
              upload_url="http://dev.lin.colorful3.com/cms/file/"
            />
          </el-col>
        </el-row>
      </el-form>
      <div class="markdown"></div>
      <editor-dialog
        ref="editorDialog"
        :editor="form.editor"
        :id="id"
        :content="form.content"
        :title="form.title"
      ></editor-dialog>
    </div>
  </div>
</template>
<script>
import EditorDialog from "./EditorDialog";
import HeadNav from "./HeadNav";
import articleApi from "@/models/article";
import settingApi from "@/models/setting";
import { User as CurrentUser } from "@/components/layout";
import { MarkdownPro } from "vue-meditor";
import Tinymce from "@/components/base/tinymce";

export default {
  name: "EditorForm",
  data() {
    return {
      form: {
        content: "",
        title: "",
        editor: 0
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
    MarkdownPro,
    Tinymce
  },
  async mounted() {
    await this.show();
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
    async getSetting() {
      let editor = await settingApi.getSettingEditor();
      this.form.editor = editor;
    },
    async show() {
      if (this.id != 0) {
        this.loading = true;
        let res = await articleApi.getArticleDraft(this.id).finally(() => {
          this.loading = false;
        });
        if (res == null || res == undefined || res == "") {
          let article = await articleApi.getArticle(this.id).finally(() => {
            this.loading = false;
          });
          this.form = {
            title: article.title,
            content: article.content,
            editor: article.editor
          };
        } else {
          this.form = {
            title: res.title,
            content: res.content,
            editor: res.editor
          };
        }
        console.log(this.form.content);
      } else {
        await this.getSetting();
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
    },
    change(val) {
      this.form.content = val;
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
