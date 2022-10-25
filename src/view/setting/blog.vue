<template>
  <div class="container">
    <div class="wrap">
      <el-row>
        <el-col :lg="24" :md="24" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="120px" @submit.native.prevent>
            <el-row>
              <!-- <el-col :lg="12">
                <el-form-item label="默认编辑器" prop="editor">
                  <el-radio-group v-model="form.editor">
                    <el-radio :label="1">MarkDown编辑器</el-radio>
                    <el-radio :label="2">富文本编辑器</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
              <el-col :lg="12">
                <el-form-item label="是否开启评论" prop="commentable">
                  <el-switch
                    v-model="form.commentable"
                    active-text="开启"
                    active-value="true"
                    inactive-value="false"
                    inactive-text="关闭"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :lg="24">
                <el-form-item label="代码风格" prop="codeTheme">
                  <el-radio-group v-model="form.codeTheme">
                    <el-radio label="tango">tango</el-radio>
                    <el-radio label="native">native</el-radio>
                    <el-radio label="monokai">monokai</el-radio>
                    <el-radio label="github">github</el-radio>
                    <el-radio label="solarized-light">solarized-light</el-radio>
                    <el-radio label="vs">vs</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="submit">
              <el-button type="primary" @click="confirmEdit('form')" v-loading="loading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import settingApi from '@/lin/model/setting'
export default {
  name: 'SettingBlog',
  data() {
    return {
      form: {
        editor: '1',
        codeTheme: 'github',
        commentable: 'true',
      },
      model: {},
      rules: {},
      loading: false,
      key: 'Article.Editor',
    }
  },
  async created() {
    let values = await settingApi.getSettingByKeys({
      keys: ['Article.Editor', 'Article.CodeTheme', 'Article.Commentable'],
    })
    if (values) {
      values['Article.Editor'] != null ? (this.form.editor = Number(values['Article.Editor'])) : ''
      values['Article.CodeTheme'] != null ? (this.form.codeTheme = values['Article.CodeTheme']) : ''
      values['Article.Commentable'] != null ? (this.form.commentable = values['Article.Commentable']) : ''
    }
  },
  methods: {
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          var settingsValue = {
            'Article.Editor': this.form.editor,
            'Article.CodeTheme': this.form.codeTheme,
            'Article.Commentable': this.form.commentable,
          }
          await settingApi.setSettingValues(settingsValue).finally(r => {
            this.loading = false
          })
          this.$message.success(`配置成功`)
        } else {
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/form';
</style>
