<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-dialog width="318px" class="lin-dialog" v-model="dialogTableVisible" :close-on-click-modal="false">
      <template #header="{ close, titleId, titleClass }">
        {{ activeIndex == 'login' ? '登录' : '注册' }}
      </template>
      <el-form :model="form" label-position="top" ref="form">
        <template v-if="activeIndex == 'login'">
          <el-form-item
            prop="username"
            :rules="[
              {
                required: true,
                message: '请输入用户名或邮件',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="form.username"
              prefix-icon="User"
              autocomplete="off"
              placeholder="请输入用户名或邮件"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input
              v-model="form.password"
              prefix-icon="Lock"
              autocomplete="off"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button type="primary" @click="submitForm" class="login-button" :disabled="loading">登录</el-button>
          </el-form-item>
          <el-form-item class="dialog-footer">
            <div class="login-to-link">
              没有账号？ <el-link type="primary" @click="activeIndex = 'register'">注册</el-link>
              <el-link style="float: right" @click="forgetPassword">忘记密码</el-link>
            </div>
          </el-form-item>
        </template>
        <template v-else-if="activeIndex == 'register'">
          <el-form-item prop="nickname" :rules="[{ required: true, message: '请输入昵称', trigger: 'blur' }]">
            <el-input
              v-model="form.nickname"
              prefix-icon="User"
              autocomplete="off"
              placeholder="请输入昵称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="email" :rules="[{ required: true, message: '请输入邮件', trigger: 'blur' }]">
            <el-input
              type="email"
              v-model="form.email"
              prefix-icon="UserFilled"
              autocomplete="off"
              placeholder="请输入邮件"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="verification_code"
            :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
          >
            <el-input
              v-model="form.verification_code"
              prefix-icon="HelpFilled"
              placeholder="请输入验证码"
              minlength="6"
              maxlength="6"
              style="width: 165px"
              clearable
            ></el-input>
            <el-button
              type="primary"
              :loading="checkCodeBtn.loading"
              :disabled="checkCodeBtn.disabled"
              @click="getCheckCode"
              style="margin-left: 5px"
            >
              {{ checkCodeBtn.text }}
            </el-button>
          </el-form-item>
          <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input
              v-model="form.password"
              prefix-icon="Lock"
              autocomplete="off"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button type="primary" @click="submitForm" :disabled="loading">注册</el-button>
          </el-form-item>
          <el-form-item class="to-login dialog-footer">
            <el-link type="primary" @click="activeIndex = 'login'"> 已有账号,去登录 </el-link>
          </el-form-item>
        </template>

        <el-form-item label="第三方账号登录" class="oauth">
          <a href="javascript:void(0);" @click="() => signin('GitHub')">
            <el-avatar class="margin-left-xs" title="github登录" size="default">
              <IconAntDesignGitHubFilled width="1em" height="1em" />
            </el-avatar>
          </a>
          <a href="javascript:void(0);" @click="() => signin('Gitee')">
            <el-avatar class="margin-left-xs" title="码云登录" size="default">
              <SimpleIconsGitee width="1em" height="1em" />
            </el-avatar>
          </a>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import User from '@/lin/model/user'
import oauth2 from '@/model/oauth2'
import Utils from '@/lin/util/util'
import IconAntDesignGitHubFilled from '~icons/ant-design/github-filled'
import SimpleIconsGitee from '~icons/simple-icons/gitee'

export default {
  name: 'LoginRegisterDialog',
  components: { IconAntDesignGitHubFilled, SimpleIconsGitee },
  data() {
    return {
      checkCodeBtn: {
        text: '获取验证码',
        loading: false,
        disabled: false,
        duration: 10,
        timer: null,
      },
      dialogTableVisible: false,
      form: {
        username: '',
        password: '',
        nickname: '',
        email: '',
        verification_code: '',
        email_code: '',
      },
      headers: {
        'Google-RecaptchaToken': '',
      },
      activeIndex: 'login', ///index
      formLabelWidth: '120px',
      loading: false,
      externalProviders: [],
    }
  },
  async created() {
    this.externalProviders = await oauth2.getExternalProviders()
  },
  methods: {
    ...mapActions(['setUserAndState']),

    async getCheckCode() {
      if (!this.form.email) {
        this.$message.error('请输入邮箱')
        return false
      }
      if (!Utils.isEmail(this.form.email)) {
        this.$message.error('请输入正确的邮箱地址')
        return false
      }
      if (this.checkCodeBtn.duration !== 10) {
        this.checkCodeBtn.disabled = true
      }
      this.checkCodeBtn.timer && clearInterval(this.checkCodeBtn.timer)
      this.checkCodeBtn.timer = setInterval(() => {
        const tmp = this.checkCodeBtn.duration--
        this.checkCodeBtn.text = `${tmp}秒`
        if (tmp <= 0) {
          clearInterval(this.checkCodeBtn.timer)
          this.checkCodeBtn.duration = 10
          this.checkCodeBtn.text = '重新获取'
          this.checkCodeBtn.disabled = false
        }
      }, 1000)
      var email_code = await User.sendEmailCode({
        email: this.form.email,
        nickname: this.form.nickname,
      })
      this.form.email_code = email_code
    },
    show(key) {
      this.dialogTableVisible = true
      this.activeIndex = key
    },
    forgetPassword() {
      this.dialogTableVisible = false
      this.$router.replace({ name: 'password-reset' })
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          // try {
          //   // Show reCAPTCHA badge:
          //   await this.$recaptchaLoaded();
          //   // Execute reCAPTCHA with action "login".
          //   this.headers['Google-RecaptchaToken'] = await this.$recaptcha(
          //     'login'
          //   );
          // } catch (e) {
          //   this.$message.error('验证码加载失败！');
          //   console.log(e);
          //   return;
          // }
          if (this.activeIndex == 'login') {
            await this.login()
          } else {
            await this.register()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async login() {
      try {
        this.loading = true
        await User.getToken(this.form, this.headers)
        this.dialogTableVisible = false
        await this.getInformation()
        this.loading = false
        // this.$router.push("/index");
        const redirect = decodeURIComponent(this.$route.query.redirect || this.$route.path)

        this.$router.push(redirect + '?d=' + Utils.getRandomStr())

        this.$message.success('登录成功')
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async register() {
      this.loading = true
      var res = await User.registerAccount(
        {
          nickname: this.form.nickname,
          password: this.form.password,
          email: this.form.email,
          verification_code: this.form.verification_code,
          email_code: this.form.email_code,
        },
        this.headers,
      ).finally(() => {
        this.loading = false
      })
      if (res.code !== 0) {
        this.$message.error(res.message)
        return
      }
      this.form.username = this.form.email
      this.$message.success('注册成功')
      // // Show reCAPTCHA badge:
      // await this.$recaptchaLoaded();
      // this.headers['Google-RecaptchaToken'] = await this.$recaptcha('login');
      await this.login()
    },
    async getInformation() {
      try {
        // 尝试获取当前用户信息
        const user = await User.getPermissions()
        this.setUserAndState(user)
      } catch (e) {
        console.log(e)
      }
    },

    signin(provider) {
      window.localStorage.setItem('OAUTH_LOGIN_URL', window.location.href)
      window.open(
        `${process.env.VUE_APP_BASE_URL}cms/oauth2/signin?provider=${provider}&redirectUrl=${process.env.VUE_APP_CURRENT_URL}`,
      )
      // var t = window.open(
      //   `${process.env.VUE_APP_BASE_URL}cms/oauth2/signin?provider=${provider}&redirectUrl=${process.env.VUE_APP_CURRENT_URL}`,
      //   "_blank",
      //   "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=600"
      // );
      // var n = window.setInterval(function() {
      //   (t && !t.closed) || (window.clearInterval(n), window.location.reload());
      // }, 300);
    },
  },
}
</script>

<style lang="scss" scoped>
span {
  font-size: 1.3rem;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 0px !important;
}
.to-login :deep(.el-form-item__content) {
  justify-content: center;
}
.dialog-footer :deep(.el-form-item__content) {
  text-align: center;

  .login-to-link {
    width: 100%;
  }

  .el-button {
    width: 270px;
  }
}

.oauth .el-form-item__content {
  .el-avatar :deep(i) {
    font-size: 27px !important;

    &:hover {
      cursor: pointer !important;
    }
  }
}
</style>
