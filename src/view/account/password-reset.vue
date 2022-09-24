<template>
  <el-row :gutter="24">
    <el-card class="box-card" style="padding: 20px 100px 100px 100px">
      <el-col :span="16" :offset="4">
        <el-steps :active="active" style="margin-top: 20px">
          <el-step title="找回密码" description="验证码将会发送至你的注册邮箱"></el-step>
          <el-step title="设置新密码" description="密码长度必须在6~22位之间，包含字符、数字和 _"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="12" :offset="6">
        <el-form
          v-show="active == 0"
          label-position="top"
          ref="form"
          style="margin-top: 60px"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="邮件" prop="email" :rules="[{ required: true, message: '请输入邮件', trigger: 'blur' }]">
            <el-input type="email" v-model="form.email" prefix-icon="position"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitNext">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form
          v-show="active == 1"
          label-position="top"
          ref="formResetPassword"
          style="margin-top: 60px"
          :model="form"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="邮件" prop="email">
            <el-input :disabled="true" v-model="form.email" type="email">
              <i slot="prefix" class="el-input__icon el-icon-position"></i>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="reset_code">
            <el-input v-model="form.reset_code" autocomplete="off" type="text" clearable>
              <i slot="prefix" class="el-input__icon el-icon-lollipop"></i>
              <el-button slot="append" type="primary" plain :disabled="reset_code.disabled" @click="getNewCode">{{
                reset_code.text
              }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" show-password autocomplete="off" clearable>
              <i slot="prefix" class="el-input__icon el-icon-postcard"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitResetPassword">重置密码</el-button>
          </el-form-item>
        </el-form>

        <el-alert
          v-show="active == 2"
          style="margin-top: 100px"
          title="提示"
          :closable="false"
          type="success"
          description="您已成功重置密码"
          show-icon
        ></el-alert>
      </el-col>
    </el-card>
  </el-row>
</template>

<script>
import User from '@/lin/model/user'
export default {
  data() {
    return {
      active: 0,
      form: {
        email: '',
        password_reset_code: '',
        reset_code: '',
        password: '',
      },
      reset_code: {
        disabled: false,
        time: 60,
        text: '重新获取邮件验证码',
      },
      rules: {
        email: [{ required: true, message: '请输入邮件', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        reset_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    onSubmitNext() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          var data = await User.sendPasswordResetCode({
            email: this.form.email,
          })
          console.log(data)
          this.form.password_reset_code = data
          if (this.active++ > 2) this.active = 0
          this.intervalResetCode()
        }
      })
    },
    onSubmitResetPassword() {
      this.$refs['formResetPassword'].validate(async valid => {
        if (valid) {
          await User.resetPassword(this.form)
          this.$notify({
            title: '提示',
            message: '修改密码成功',
            type: 'success',
          })
          if (this.active++ > 2) this.active = 0
        }
      })
    },
    async getNewCode() {
      this.form.password_reset_code = await User.sendPasswordResetCode({
        email: this.form.email,
      })
      this.intervalResetCode()
    },
    intervalResetCode() {
      let interval = setInterval(() => {
        this.reset_code.time--
        this.reset_code.text = this.reset_code.time + '秒后中重发'
        this.reset_code.disabled = true
        if (this.reset_code.time <= 0) {
          window.clearInterval(interval)
          this.reset_code.time = 60
          this.reset_code.text = '重新获取邮件验证码'
          this.reset_code.disabled = false
        }
      }, 1000)
    },
  },
}
</script>

<style></style>
