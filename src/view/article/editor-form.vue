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
import EditorDialog from "./editor-dialog";
import HeadNav from "./head-nav";
import articleApi from "@/model/article";
import settingApi from "@/model/setting";
import { User as CurrentUser } from "@/component/layout";
import { MarkdownPro } from "vue-meditor";
import Tinymce from "@/component/base/tinymce";

export default {
  name: "EditorForm",
  data() {
    return {
      form: {
        content: "",
        title: "",
        editor: 1
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
      if (editor != "" && editor != null) {
        this.form.editor = editor;
      }
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

.markdown /deep/ {
  .markdown-preview {
    color: #24292e;
    ul li,
    a,
    p {
      line-height: 1.6;
      font-size: 15px !important;

      font-family: "-apple-system", BlinkMacSystemFont, "\5FAE\8F6F\96C5\9ED1",
        "PingFang SC", Helvetica, Arial, "Hiragino Sans GB", "Microsoft YaHei",
        SimSun, "\5B8B\4F53", Heiti, "\9ED1\4F53", sans-serif;
    }
    img {
      width: auto;
    }
    pre {
      color: #333;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 2px;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #333;
      line-height: 1.25;
      margin-top: 24px;
      margin-bottom: 16px;
      padding-bottom: 5px;
    }
    p,
    blockquote,
    ul,
    ol,
    dl,
    table,
    pre {
      margin-top: 0;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 30px;
      margin-bottom: 5px;
    }
    h2 {
      margin-top: 20px;
      border-bottom: 1px solid #eaecef;
    }
    h3 {
      margin-top: 10px;
    }
    h4,
    h5,
    h6 {
      margin-top: 5px;
    }
    // table tr:nth-of-type(even) td {
    //   background-color: #f6f8fa;
    // }
    ul li:after {
      width: 4px;
      height: 4px;
    }

    ul li input[type="checkbox"]:before {
      z-index: 199 !important;
    }
  }

  .markdown-theme-dark pre code,
  .code-block p {
    color: #fff;
  }
  blockquote p {
    margin-bottom: 0px;
  }
  a {
    color: #4285f4;
    &:hover {
      text-decoration: underline;
    }
  }
  .preview-img .close {
    right: 22px;
  }
}

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
