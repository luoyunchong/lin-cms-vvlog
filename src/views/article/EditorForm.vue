<template>
  <div class="editor-container">
    <el-form
      :rules="rules"
      :model="form"
      status-icon
      ref="form"
      label-width="100px"
      @submit.native.prevent
    >
      <el-row>
        <el-col :lg="12">
          <el-input size="medium" v-model="form.title" placeholder="请填写标题" style="font-size:2rem;"></el-input>
        </el-col>
        <el-col :lg="12">
          <el-form-item>
            <el-button type="success" @click="confirmEdit('form')" icon="el-icon-edit">发布文章</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div id="vditor" />
    <editor-dialog ref="editorDialog" :id="id" @submit="submitForm"></editor-dialog>
  </div>
</template>
<script>
import Vditor from "vditor";
import EditorDialog from "./EditorDialog";
import articleApi from "@/models/article";

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
    EditorDialog
  },
  async mounted() {
    this.show();
    this.initVditor();
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
          // 'table',
          // 'record',
          // 'fullscreen',
          // 'info',
          "both",
          "preview",
          {
            hotkey: "⌘-⇧-m",
            name: "wysiwyg",
            tipPosition: "nw"
          },
          "format",
          "devtools",
          "help"
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
      if (this.id) {
        this.loading = true;
        let res = await articleApi.getArticle(this.id).finally(() => {
          this.loading = false;
        });
        this.form = res;
        this.vditor.setValue(res.content);
      } else {
        this.resetForm("form");
      }
    },
    async confirmEdit(formName) {
      this.$refs["editorDialog"].show();
    },
    async submitForm(form) {
      let objForm = Object.assign(form, {
        title: this.form.title,
        content: this.vditor.getValue()
      });
      if (this.id) {
        await articleApi.editArticle(this.id, objForm);
      } else {
        await articleApi.addArticle(objForm);
      }
      this.$message.success(`发布成功!`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";

.editor-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .vditor {
    position: absolute;
    top: 37px;
    height: calc(100vh - 100px);
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
    .vditor {
      height: calc(100vh - 60px);
      padding: auto 10px;
      margin: 0px auto;
    }
  }
}
</style>
