<template>
  <el-dialog
    width="500px"
    title="修改密码"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogFormVisible"
    class="user-dialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" label-position="left" ref="form" label-width="90px" @submit.native.prevent>
      <el-form-item label="原始密码" prop="old_password">
        <el-input
          type="password"
          v-model="form.old_password"
          autocomplete="off"
          show-password
          placeholder="请输入原密码（初次设置时可留空）"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input
          type="password"
          v-model="form.new_password"
          autocomplete="off"
          show-password
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password" label-position="top">
        <el-input
          type="password"
          v-model="form.confirm_password"
          autocomplete="off"
          show-password
          placeholder="请重新输入新密码"
        ></el-input>
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
import User from '@/lin/model/user'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    const oldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('原始密码不能为空'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      rules: {
        // old_password: [
        //   { validator: oldPassword, trigger: "blur", required: true }
        // ],
        new_password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
      },
      saveLoading: false,
    }
  },
  created() {},
  methods: {
    ...mapActions(['loginOut', 'setUserAndState']),
    show() {
      this.dialogFormVisible = true
    },
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.old_password === this.form.new_password) {
            this.$message.error('新密码不能与原始密码一样')
            return false
          }
          this.saveLoading = true
          const res = await User.updatePassword(this.form).finally(r => {
            that.saveLoading = false
          })
          if (res.code === 0) {
            this.$message.success(`${res.message}`)
            this.$refs[formName].resetFields()
            this.dialogFormVisible = false
            setTimeout(() => {
              this.loginOut()
              const { origin } = window.location
              window.location.href = origin
            }, 1000)
          }
        } else {
          console.log('error submit!!')
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
