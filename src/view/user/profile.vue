<template>
  <div class="profile-wrapper">
    <el-avatar :size="160" shape="circle" fit="cover" :src="openUser.avatar" class="profile-avatar">
      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
    </el-avatar>
    <div class="profile-main">
      <div class="title">
        <h2 class="nickname" :href="`/user/${openUser.id}/article`">{{ openUser.nickname }}</h2>
      </div>
      <p class="info-box info-introduction">
        <i class="el-icon-postcard"></i>
        <span> {{ openUser.job_title }}</span>
        <span class="divider">|</span>
        <span> {{ openUser.company }}</span>
      </p>
      <p class="info-box">
        <i class="el-icon-microphone"></i>
        <span>{{ openUser.introduction }}</span>
      </p>
      <div class="info-box">
        <router-link :to="{ path: `/p/editor/0` }" class="item-button media_mobile">
          <el-button type="primary" plain>
            <el-icon class="el-icon--left">
              <Edit />
            </el-icon>写随笔
          </el-button>
        </router-link>
        <router-link :to="{ path: '/setting/profile' }" class="item-button">
          <el-button type="primary" v-if="user != null && user.id == openUser.id">
            <el-icon class="el-icon--left">
              <Edit />
            </el-icon>编辑个人资料
          </el-button>
        </router-link>
        <subscribe-button :userId="openUser.id" v-if="user == null || (user != null && user.id != openUser.id)">
        </subscribe-button>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/lin/model/user'
import subscribeApi from '../../model/subscribe'
import { SubscribeButton } from '@/view/subscribe'
import defaultAvatar from '@/assets/image/user/user.png'
export default {
  name: 'Profile',
  components: { SubscribeButton },
  data() {
    return {
      openUser: {
        id: 0,
      },
      defaultAvatar,
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    user() {
      return this.$store.state.user
    },
  },
  watch: {
    async userId(newVal) {
      await this.getUserByUserId()
    },
  },
  async created() {
    await this.getUserByUserId()
  },
  methods: {
    async getUserByUserId() {
      if (this.userId != null) {
        this.openUser = await userApi.getUserByUserId(this.userId)
        if (this.openUser.job_title == null) {
          this.openUser.job_title = '无'
        }
        if (this.openUser.company == null) {
          this.openUser.company = '无'
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-wrapper {
  display: flex;
  padding: 10px;

  .profile-avatar {
    flex: 0 0 auto;
    display: inline-block;
    border: 4px solid #fff;
    margin-right: 24px;
  }

  .profile-main {
    flex: 1 1 auto;

    .info-box {
      color: #72777b;
      padding-top: 18px;
      font-size: 0.8rem;
      line-height: 22px;

      .divider {
        padding: 0 5px;
      }

      i {
        margin-right: 5px;
      }
    }

    .info-introduction {
      line-height: 22px;
    }

    .nickname {
      font-size: 26px;
      vertical-align: middle;
      margin-block-start: 0;
      margin-block-end: 0;
    }
  }
}


.item-button {
  padding-bottom: 18px;
  padding-right: 10px;
  float: right;
}

.media_mobile {
  display: none;
}

@media (max-width: 600px) {

  .profile-wrapper {
    flex-direction: column;
    align-items: center;

    .profile-avatar {
      margin-right: 0;
    }

    .media_mobile {
      display: block;
    }
  }

}
</style>
