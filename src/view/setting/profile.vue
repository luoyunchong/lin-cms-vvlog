<template>
  <div class="container">
    <div class="wrap">
      <el-row>
        <el-col :lg="24" :md="24" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" label-width="120px" @submit.native.prevent>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input size="default" v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="职位" prop="job_title">
                  <el-input size="default" v-model="form.job_title" placeholder="职位"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="公司" prop="company">
                  <el-input size="default" v-model="form.company" placeholder="公司"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="个人网站" prop="blog_address">
                  <el-input size="default" v-model="form.blog_address" placeholder="http(s)://您的网站"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="个人简介" prop="introduction">
                  <el-input
                    type="textarea"
                    size="default"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    v-model="form.introduction"
                    placeholder="请填写个人简介"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="submit">
              <el-button type="primary" @click="confirmEdit('form')" v-loading="loading">更新基本信息</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import userApi from '@/lin/model/user'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Profile',
  data() {
    return {
      form: {
        nickname: '',
        introduction: '',
        blog_address: '',
        job_title: '',
        company: '',
      },
      rules: {
        nickname: [{ required: true, message: '昵称为必填项', trigger: 'blur' }],
      },
      loading: false,
    }
  },
  async created() {
    this.form.nickname = this.user.nickname
    this.form.introduction = this.user.introduction
    this.form.blog_address = this.user.blog_address
    await this.getUserByUserId()
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['setUserAndState']),
    async getUserByUserId() {
      if (this.user.id != null) {
        var openUser = await userApi.getUserByUserId(this.user.id)
        this.form.nickname = openUser.nickname
        this.form.job_title = openUser.job_title
        this.form.company = openUser.company
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await userApi.updateProfile(this.form).finally(r => {
            this.loading = false
          })
          if (res.code === 0) {
            this.$message.success(`${res.message}`)
            userApi.getInformation().then(res => {
              this.setUserAndState(res)
            })
          }
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
