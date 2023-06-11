<template>
  <el-dialog width="500px" title="新建收藏集" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible"
    class="user-dialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-position="left" ref="form" label-width="90px" @submit.native.prevent>
      <el-form-item label="名称" prop="name">
        <el-input type="text" v-model="form.name" autocomplete="off" placeholder="请输入收藏集名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 5 }" maxlength="100" v-model="form.remark"
          autocomplete="off" placeholder="请输入收藏描述（限100字，选填）"></el-input>
      </el-form-item>
      <el-form-item label="隐私类型" prop="privacy_type" label-position="top">
        <el-radio v-model="form.privacy_type" :label="0">公开 当其他人关注此收藏集后不可再更改为隐私</el-radio>
        <el-radio v-model="form.privacy_type" :label="1">隐私 仅自己可见此收藏集</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="submitForm('form')">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import collectionApi from '@/model/collection.js'
export default {
  name: 'CollectionForm',
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        remark: '',
        privacy_type: 0,
      },
      rules: {
        name: [{ trigger: 'blur', required: true, message: '请输入收藏集名称' }],
      },
      saveLoading: false,
    }
  },
  created() { },
  methods: {
    show(id) {
      this.dialogFormVisible = true
      this.getCollection(id)
    },
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    getCollection(id) {
      this.id = id;
      if (this.id == 0 || this.id == undefined) return;
      collectionApi.getCollection(this.id).then(res => {
        this.form = res
      })
    },
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res;
          if (this.id == 0 || this.id == undefined) {
            res = await collectionApi.createCollection(this.form).finally(r => {
              that.saveLoading = false
            })
          } else {
            res = await collectionApi.updateCollection(this.id, this.form).finally(r => {
              that.saveLoading = false
            })
          }

          if (res.code === 0) {
            this.$message.success(`${res.message}`)
            this.$refs[formName].resetFields()
            this.dialogFormVisible = false
            this.$emit('success', res.count)
          }
        } else {
          console.log('error submit!')
          this.$message.error('请填写正确的信息')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.user-dialog :deep(.el-dialog .el-dialog__header) {
  border-bottom: 1px solid #dae1ed;
  padding-bottom: 20px;
}

.user-dialog :deep(.el-dialog .el-dialog__body) {
  padding-bottom: 00px;
}
</style>
