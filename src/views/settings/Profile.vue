<template>
  <div class="container">
    <div class="wrap">
      <el-row>
        <el-col :lg="24" :md="24" :sm="24" :xs="24">
          <el-form :rules="rules" :model="form" status-icon ref="form" @submit.native.prevent>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input size="medium" v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="12">
                <el-form-item label="个人简介" prop="introduction">
                  <el-input
                    type="textarea"
                    size="medium"
                    :autosize="{ minRows: 4, maxRows: 8}"
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
import userApi from "@/lin/models/user";
import { mapActions } from "vuex";
export default {
  name: "Profile",
  data() {
    return {
      form: {
        nickname: "",
        introduction: ""
      },
      rules: {
        nickname: [{ required: true, message: "昵称为必填项", trigger: "blur" }]
      },
      loading: false
    };
  },
  created() {
    this.form.nickname = this.user.nickname;
    this.form.introduction = this.user.introduction;
  },
  methods: {
    ...mapActions(["setUserAndState"]),
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          const res = await userApi.updateProfile(this.form).finally(r => {
            this.loading = false;
          });
          if (res.code === 0) {
            this.$message.success(`${res.message}`);
            userApi.getInformation().then(res => {
              this.setUserAndState(res);
            });
          }
        } else {
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>