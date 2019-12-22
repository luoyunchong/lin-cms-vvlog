<template>
  <div>
    <div class="profile-wrapper">
      <div class="profile-main">
        <el-avatar
          icon="el-icon-user"
          :size="160"
          shape="square"
          fit="cover"
          :src="openUser.avatar||defaultAvatar"
          class="profile-avatar"
        ></el-avatar>

        <div class="profile-content">
          <div class="title">
            <a class="nickname" :href="`/user/${openUser.id}/article`">{{openUser.nickname}}</a>
          </div>
          <p class="info-box info-introduction">
            <i class="el-icon-postcard"></i>
            <span>{{openUser.introduction}}</span>
          </p>
          <p class="info-box">
            <i class="el-icon-microphone"></i>
            <span>{{openUser.username}}</span>
          </p>
          <div class="info-box item-button">
            <router-link :to="{path:'/settings/profile'}">
              <el-button
                type="primary"
                icon="el-icon-edit"
                v-if="user!=null&&user.id==openUser.id"
              >编辑个人资料</el-button>
            </router-link>
            <subscribe-button
              :userId="openUser.id"
              v-if="user==null||(user!=null&&user.id!=openUser.id)"
            ></subscribe-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/lin/models/user";
import subscribeApi from "../../models/subscribe";
import { SubscribeButton } from "@/views/subscribe";
import defaultAvatar from "@/assets/img/user/user.png";
export default {
  name: "Profile",
  components: { SubscribeButton },
  data() {
    return {
      openUser: {
        id: 0
      },
      defaultAvatar
    };
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  watch: {
    async userId(newVal) {
      await this.getUserByUserId();
    }
  },
  async created() {
    await this.getUserByUserId();
  },
  methods: {
    async getUserByUserId() {
      this.openUser = await userApi.getUserByUserId(this.userId);
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-wrapper {
  position: relative;
  .profile-main {
    position: relative;
    margin: 0 20px 24px;
  }
}
.profile-avatar {
  position: absolute;
  display: inline-block;
  border: 4px solid #fff;
  border-radius: 8px;
}
.profile-content {
  padding-top: 16px;
  padding-left: 32px;
  border-left: 164px solid transparent;
  .nickname {
    font-size: 26px;
    font-weight: 700;
    vertical-align: middle;
  }
}
.info-box {
  padding-top: 18px;
  i {
    margin-right: 5px;
  }
}
.info-introduction {
  line-height: 22px;
}
.item-button {
  padding-bottom: 18px;
  float: right;
}
</style>