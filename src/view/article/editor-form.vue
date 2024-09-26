<template>
  <div>
    <head-nav @confirmEdit="confirmEdit"></head-nav>
    <div class="editor-container">
      <el-form class="editor-form" :rules="rules" :model="form" status-icon ref="form" label-width="100px"
        @submit.native.prevent>
        <el-row>
          <el-col :lg="24">
            <el-form-item prop="title" style="margin-bottom: 0px !important">
              <el-input class="editor-title" size="default" v-model="form.title" placeholder="请填写随笔标题"
                style="font-size: 1.4rem"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <div class="index-page" v-loading="isLoading">
              <div id="vditor" class="vditor" style="margin-top: 0px !important" />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="markdown"></div>
      <editor-dialog ref="editorDialog" :editor="form.editor" :id="id" :content="form.content" :title="form.title">
      </editor-dialog>
    </div>
  </div>
</template>
<script>
import EditorDialog from './editor-dialog'
import HeadNav from './head-nav'
import articleApi from '@/model/article'
import settingApi from '@/model/setting'
import { User as CurrentUser } from '@/component/layout'
import Vditor from 'vditor'
import axios from 'lin/plugin/axios'
export default {
  name: 'EditorForm',
  data() {
    return {
      isLoading: false,
      form: {
        content: '',
        title: '',
      },
      codeTheme: 'github',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
      vditor: null,
    }
  },
  components: {
    EditorDialog,
    CurrentUser,
    HeadNav,
  },
  async mounted() {
    this.initVditor()
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  async created() { },
  watch: {
    async $route(to, from) {
      await this.show()
    },
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    initVditor() {
      const that = this
      const options = {
        width: '100%',
        height: 'calc(100vh - 100px)',
        tab: '\t',
        counter: '999999',
        typewriterMode: true,
        hint: {
        },
        mode: 'sv', //ir 即时渲染，sv 分屏预览 wysiwyg 所见即所得
        cdn: 'http://101.34.7.82/vditor',
        preview: {
          delay: 100,
          show: true,
          markdown: {
            toc: true,
            theme: 'light',
            mark: true
          },
          hljs: {
            enable: true,
            style: 'github',
            lineNumber: true,
          },
          mode: 'both',
        },
        upload: {
          accept: 'image/*',
          max: 8 * 1024 * 1024,
          handler(files) {
            const data = {}
            files.forEach((item, index) => {
              data[`file_${index}`] = item
            })
            axios({
              method: 'post',
              url: '/cms/file',
              data,
            }).then(res => {
              if (!Array.isArray(res) || res.length === 0) {
                throw new Error('图像上传失败')
              }
              if (res.length > 0) {
                var imgMdStr = ``
                res.forEach((re, i) => {
                  console.log(files)
                  if (files[i].type == 'video/webm') {
                    imgMdStr = `<audio controls="controls" src="${re.url}"></audio>`
                  } else if (files[i].type.indexOf('video') != -1) {
                    imgMdStr = `[${files[i].name}](${re.url})`
                  } else {
                    imgMdStr = `![${files[i].name}](${re.url})`
                  }
                  that.vditor.insertValue(imgMdStr)
                })
                that.vditor.enable()
              }
            })
          },
        },
        outline: {
          enable: true,
          position: 'left'
        },
        after: () => {
          this.show()
        },
        cache: {
          enable: false,
        },
        theme: 'light',
        blur(value) {
          that.handleOnSave(value)
        },
        icon: 'ant',
      }
      this.vditor = new Vditor('vditor', options)
    },
    async show() {
      if (this.id != 0 && this.id != null) {
        this.loading = false
        let res = await articleApi.getArticleDraft(this.id).finally(() => {
          this.loading = false
        })
        if (res == null || res == undefined || res == '') {
          let article = await articleApi.getArticle(this.id).finally(() => {
            this.loading = false
          })
          document.title = article.title

          this.form = {
            title: article.title,
            content: article.content,
            editor: article.editor,
          }
        } else {
          this.vditor.setValue(res.content)
          this.form = {
            title: res.title,
            content: res.content,
            editor: res.editor,
          }
          document.title = res.title
        }
      }

      let codeTheme = await settingApi.getSettingByKey('Article.CodeTheme')
      if (codeTheme != '' && codeTheme != null) {
        this.codeTheme = codeTheme
        this.vditor.setTheme('classic', 'light', this.codeTheme)
      }
    },
    async confirmEdit() {
      var that = this
      this.$refs['form'].validate(async valid => {
        if (valid) {
          that.form.content = that.vditor.getValue()
          that.$refs['editorDialog'].show()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form.content = ''
    },
    async handleOnSave(value) {
      if (this.id == 0 || this.form.title == '' || value == '' || value.trim() == '') return
      await articleApi.editArticleDraft(this.id, {
        title: this.form.title,
        content: value,
      })
      console.log('自动保存')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
@import '~vditor/dist/index.css';

.index-page {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .vditor {
    position: absolute;
    max-width: 1440px;
    margin: 20px auto;
    text-align: left;
  }

  .vditor-reset {
    font-size: 14px;
  }

  .vditor-textarea {
    font-size: 14px;
    height: 100% !important;
  }
}

@media (max-width: 960px) {
  .index-page {
    .vditor {
      height: calc(100vh - 60px);
      padding: auto 10px;
      margin: 0px auto;
    }
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

    :deep(.el-form-item__content) {
      margin-left: 0px !important;
    }
  }

  .editor-title :deep(.el-input__inner) {
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
