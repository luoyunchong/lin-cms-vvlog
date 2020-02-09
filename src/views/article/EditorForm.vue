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
          <el-col :lg="24">
            <el-input
              class="editor-title"
              size="medium"
              v-model="form.title"
              placeholder="请填写随笔标题"
              style="font-size:1.4rem;"
            ></el-input>
          </el-col>
          <!-- <el-col :lg="6">
          <div style="line-height:55px;height:55px;margin-left:10px;">
            <el-button type="primary" @click="confirmEdit('form')" icon="el-icon-edit" plain>发布随笔</el-button>
          </div>
          </el-col>-->
        </el-row>
      </el-form>
      <div id="vditor" />
      <editor-dialog ref="editorDialog" :id="id" @submit="submitForm"></editor-dialog>
    </div>
  </div>
</template>
<script>
import Vditor from "vditor";
import EditorDialog from "./EditorDialog";
import HeadNav from "./HeadNav";
import articleApi from "@/models/article";
import { User as CurrentUser } from "@/components/layout";

export default {
  name: "EditorForm",
  data() {
    return {
      vditor: null,
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
    HeadNav
  },
  async mounted() {
    this.initVditor();
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
    initVditor() {
      const that = this;
      const options = {
        cache: true,
        mode: "markdown-show",
        toolbar: [
          "emoji",
          "headings",
          "bold",
          "italic",
          "strike",
          "line",
          "quote",
          "list",
          "ordered-list",
          "check",
          "code",
          "inline-code",
          "undo",
          "redo",
          "upload",
          "link",
          {
            hotkey: "⌘-m",
            name: "table",
            prefix: "| 左对齐",
            suffix:
              " | 居中 | 右对齐 |\n| :--- | :---: | ---: |\n| TODO | DOING | DONE |\n|  |  |  |",
            tipPosition: "n"
          },
          "both",
          "preview",
          {
            hotkey: "⌘-⇧-m",
            name: "wysiwyg",
            tipPosition: "nw"
          },
          "format",
          "fullscreen"
        ],
        width: this.isMobile ? "100%" : "100%",
        height: "0",
        tab: "\t",
        counter: "999999",
        typewriterMode: true,
        preview: {
          delay: 100,
          show: !this.isMobile
        },
        upload: {
          max: 5 * 1024 * 1024,
          // linkToImgUrl: 'https://sm.ms/api/upload',
          handler(file) {
            let formData = new FormData();
            for (let i in file) {
              formData.append("smfile", file[i]);
            }
            let request = new XMLHttpRequest();
            request.open("POST", "https://sm.ms/api/upload");
            request.onload = that.onloadCallback;
            request.send(formData);
          }
        }
      };
      this.vditor = new Vditor("vditor", options);
      this.vditor.focus();
    },
    async show() {
      if (this.id != 0) {
        this.loading = true;
        let res = await articleApi.getArticle(this.id).finally(() => {
          this.loading = false;
        });
        this.form = res;
        this.vditor.setValue(res.content);
      } else {
        this.resetForm("form");
        this.vditor.setValue("");
      }
    },
    async confirmEdit() {
      this.$refs["editorDialog"].show();
    },
    async submitForm(form) {
      let objForm = Object.assign(form, {
        title: this.form.title,
        content: this.vditor.getValue()
      });
      if (this.id != 0) {
        await articleApi.editArticle(this.id, objForm);
      } else {
        await articleApi.addArticle(objForm);
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
  .vditor {
    height: calc(100vh - 200px);
    width: 80%;
    margin: 20px auto;
    text-align: left;
    max-width: 1440px;
  }
  #vditor /deep/ {
    img {
      width: fit-content;
    }
    a {
      color: #4285f4;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 960px) {
  .editor-container {
    .editor-form {
      width: 100%;
      margin: auto;
      max-width: 1440px;
    }
    .vditor {
      height: calc(100vh - 60px);
      padding: auto 10px;
      margin: 20px auto;
    }
  }
}
</style>
