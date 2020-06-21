<template>
  <div class="container">
    <div class="wrap">
      <el-row>
        <el-col :lg="24" :md="24" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" @submit.native.prevent>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="默认编辑器" prop="editor">
                  <el-radio-group v-model="form.editor">
                    <el-radio :label="1">MarkDown编辑器</el-radio>
                    <el-radio :label="2">富文本编辑器</el-radio>
                  </el-radio-group>
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
import settingApi from '@/lin/model/setting';
export default {
  name: 'SettingBlog',
  data() {
    return {
      form: {
        editor: 1,
        codeTheme: 'github'
      },
      model: {},
      rules: {},
      loading: false,
      key: 'Article.Editor'
    };
  },
  async created() {
    let val = await settingApi.getSettingByKey({ key: 'Article.Editor' });
    if (val) {
      this.form.editor = val;
    }
    let codeTheme = await settingApi.getSettingByKey({
      key: 'Article.CodeTheme'
    });
    if (codeTheme) {
      this.form.codeTheme = codeTheme;
    }
  },
  methods: {
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          await settingApi.setSettingValues({
            'Article.Editor': this.form.editor
          });

          await settingApi
            .setSettingValues({ 'Article.CodeTheme': this.form.codeTheme })
            .finally(r => {
              this.loading = false;
            });
          this.$message.success(`配置成功`);
        } else {
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/style/form.scss';
</style>