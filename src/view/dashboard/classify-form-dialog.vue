<template>
  <el-dialog
    width="500px"
    title="新建专栏"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogFormVisible"
    class="user-dialog"
  >
    <el-form :model="form" :rules="rules" label-position="left" ref="form" label-width="90px" @submit.native.prevent>
      <el-form-item label="名称" prop="classify_name">
        <el-input
          type="text"
          v-model="form.classify_name"
          autocomplete="off"
          placeholder="请输入专栏名称"
          maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="专栏封面" prop="thumbnail">
        <upload-image ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
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
import classifyApi from '@/model/classify.js'
import UploadImage from '@/component/base/upload-image'
export default {
  components: { UploadImage },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        classify_name: '',
        thumbnail: '',
      },
      thumbnailPreview: [],
      rules: {
        classify_name: [{ trigger: 'blur', required: true, message: '请输入专栏名称' }],
        thumbnail: [{ required: true, message: '请上传封面', trigger: 'blur' }],
      },
      saveLoading: false,
    }
  },
  created() {},
  methods: {
    show(id) {
      this.dialogFormVisible = true
      this.getClassify(id)
    },
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    getClassify(id) {
      this.id = id
      if (this.id == 0 || this.id == undefined) {
        this.form = {
          classify_name: '',
          thumbnail: '',
        }
        this.$refs['thumbnail'].clear()
        return
      }
      classifyApi.getClassify(this.id).then(res => {
        this.form = res
        if (res.thumbnail) {
          this.thumbnailPreview = [
            {
              id: res.id,
              display: res.thumbnail_display,
              src: res.thumbnail,
              imgId: res.id,
            },
          ]
        }
      })
    },
    async submitForm(formName) {
      var that = this

      let thumbnail = await this.$refs['thumbnail'].getValue()
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].src
      } else {
        this.form.thumbnail = ''
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res
          if (this.id == 0 || this.id == undefined) {
            res = await classifyApi.createClassify(this.form).finally(r => {
              that.saveLoading = false
            })
          } else {
            res = await classifyApi.updateClassify(this.id, this.form).finally(r => {
              that.saveLoading = false
            })
          }

          if (res.code === 0) {
            this.$message.success(`${res.message}`)
            this.$refs[formName].resetFields()
            this.dialogFormVisible = false
            this.$emit('success', res.count)
          }
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
