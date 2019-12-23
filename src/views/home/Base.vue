<template>
  <div>
    <el-row>
      <el-col
        :xs=" {span: 24, offset: 0}"
        :md="{span:18,offset:3}"
        :lg=" {span: 14, offset: 4}"
        :xl="{span: 14, offset: 5}"
        :xll="{span: 14, offset: 5}"
      >
        <el-container>
          <div class="headerWrapper">
            <el-header style="padding:0;background:#fff;" class="main-header">
              <div class="header-container">
                <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                  <!-- text-color="#000"
                  background-color="#fff"
                  active-text-color="#ffd04b"-->
                  <el-menu-item index="/index" class="block">
                    <router-link :to="{path:'/index'}">首页</router-link>
                  </el-menu-item>
                  <el-menu-item index="/subscribe" class="block">
                    <router-link :to="{path:'/subscribe'}">关注</router-link>
                  </el-menu-item>
                  <el-menu-item index="/tag" class="block">
                    <router-link :to="{path:'/tag'}">标签</router-link>
                  </el-menu-item>
                  <template>
                    <el-menu-item index="login" v-show="!logined" style="float:right;">
                      <el-link>登录</el-link>
                    </el-menu-item>
                    <el-menu-item index="register" v-show="!logined" style="float:right;">
                      <el-link>注册</el-link>
                    </el-menu-item>
                    <el-menu-item v-if="logined" style="float:right;">
                      <current-user class="current-user"></current-user>
                    </el-menu-item>
                  </template>
                </el-menu>
              </div>
            </el-header>
          </div>
          <div class="mainWrapper" :class="device">
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
            <!-- <el-backtop class="lin-back-top"></el-backtop> -->
          </div>
        </el-container>
      </el-col>
    </el-row>

    <el-dialog
      width="318px"
      class="lin-dialog"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <span slot="title">{{activeIndex=='login'?'登录':'注册'}}</span>
      <el-form :model="form" label-position="top" ref="form">
        <template v-if="activeIndex=='login'">
          <el-form-item
            prop="username"
            :rules="[
              { required: true, message: '请输入用户名或手机号', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-user"
              autocomplete="off"
              placeholder="请输入用户名或手机号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              autocomplete="off"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer lin-form-item">
            <el-button type="primary" @click="submitForm">登录</el-button>
          </el-form-item>
          <el-form-item class="lin-form-item">
            没有账号？
            <el-link type="primary" @click="activeIndex='register'">注册</el-link>
            <el-link href="/reset-password" style="float:right;">忘记密码</el-link>
          </el-form-item>
        </template>
        <template v-else-if="activeIndex=='register'">
          <el-form-item
            prop="nickname"
            :rules="[
              { required: true, message: '请输入昵称', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.nickname"
              prefix-icon="el-icon-user"
              autocomplete="off"
              placeholder="请输入昵称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            :rules="[
              { required: true, message: '请输入邮件', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.email"
              prefix-icon="el-icon-user"
              autocomplete="off"
              placeholder="请输入邮件"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              autocomplete="off"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer lin-form-item">
            <el-button type="primary" @click="submitForm">注册</el-button>
          </el-form-item>
          <el-form-item class="lin-form-item to-login">
            <el-link type="primary" @click="activeIndex='login'">已有账号,去登录</el-link>
          </el-form-item>
        </template>

        <el-form-item label="第三方账号登录" class="oauth lin-form-item">
          <el-avatar icon="iconfont icon-QQ" title="qq登录" size="large"></el-avatar>
          <el-button type="primary" @click="()=>signin('GitHub')">GitHub</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import User from "@/lin/models/user";
import Utils from "@/lin/utils/util";
import { User as CurrentUser } from "@/components/layout";
import { mixinDevice } from "@/lin/utils/mixin";
export default {
  name: "Base",
  components: { CurrentUser },
  mixins: [mixinDevice],
  data() {
    return {
      activeIndex: "", ///index
      dialogTableVisible: false,
      form: {
        username: "",
        password: ""
      },
      formLabelWidth: "120px",
      loading: false
    };
  },
  computed: {
    logined() {
      return this.$store.state.logined;
    }
  },
  created() {
    this.activeIndex = this.$route.path;
  },
  watch: {
    $route() {
      this.activeIndex = this.$router.path;
    }
  },
  methods: {
    ...mapActions(["setUserAndState"]),
    ...mapMutations({
      setUserAuths: "SET_USER_AUTHS"
    }),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == "login" || key == "register") {
        this.dialogTableVisible = true;
        this.activeIndex = key;
        return;
      }
      switch (key) {
        case "/home/index":
          // this.flushCom();
          break;
      }
      // this.$router.push(key);
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.activeIndex == "login") {
            this.login();
          } else {
            this.register();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async login() {
      try {
        this.loading = true;
        await User.getToken(this.form.username, this.form.password);
        this.dialogTableVisible = false;
        await this.getInformation();
        this.loading = false;
        // this.$router.push("/index");
        const redirect = decodeURIComponent(
          this.$route.query.redirect || this.$route.path
        );

        this.$router.push(redirect + "?d=" + Utils.getRandomStr());

        this.$message.success("登录成功");
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    async register() {
      this.loading = true;
      await User.register({
        nickname: this.form.nickname,
        password: this.form.password,
        email: this.form.email
      }).finally(() => {
        this.loading = false;
      });
      this.form.username = this.form.email;
      this.$message.success("注册成功");

      await this.login();
    },
    async getInformation() {
      try {
        // 尝试获取当前用户信息
        const user = await User.getAuths();
        this.setUserAndState(user);
        this.setUserAuths(user.auths);
      } catch (e) {
        console.log(e);
      }
    },
    flushCom: function() {
      this.$router.go(0);
    },
    signin(provider) {
      window.open(
        `https://localhost:5001/cms/oauth2/signin?provider=${provider}&redirectUrl=http://localhost:8081/login-result`
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.headerWrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1501;
}
.mainWrapper {
  height: calc(100% - 80px);
  margin-top: 80px;
  padding-left: 0px;
  width: 100%;
  padding-right: 0px;
  .lin-backtop {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
}
.main-header {
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
  height: 5rem;
}
.header-container {
  max-width: 1100px;
  margin: auto;
  height: 100%;
  /deep/ .block {
    padding: 0px;
    a {
      display: block;
      padding: 0 20px;
    }
  }
  .current-user {
    height: 60px;
    /deep/ .el-dropdown {
      top: 10px;
      left: 5px;
    }
  }
}
.lin-dialog {
  span {
    font-size: 1.3rem;
    font-weight: bold;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .lin-form-item /deep/ .el-form-item__content {
    margin-bottom: 0px !important;
  }
  .to-login {
    text-align: center;
  }
  .dialog-footer {
    text-align: center;

    .el-button {
      width: 270px;
    }
  }
  .oauth .el-form-item__content {
    .el-avatar /deep/ i.icon-QQ {
      font-size: 22px !important;
      &:hover {
        cursor: pointer !important;
      }
    }
  }
}
</style>