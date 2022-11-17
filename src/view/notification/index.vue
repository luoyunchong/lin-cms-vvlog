<template>
  <el-container>
    <el-header class="vv-header">
      <el-menu mode="horizontal" :default-active="activeIndex" :router="true" :ellipsis="false">
        <el-menu-item index="userComment"> <i class="el-icon-chat-round"></i>评论 </el-menu-item>
        <el-menu-item index="userLike">
          <el-icon>
            <Star />
          </el-icon>
          喜欢和赞
        </el-menu-item>
        <el-menu-item index="userLikeUser"> <i class="el-icon-user"></i>关注 </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside class="vv-aside">
        <el-menu class="el-menu-profile" :default-active="activeIndex" :router="true" :ellipsis="false">
          <el-menu-item-group>
            <template #title><i class="el-icon-bell"></i><span style="margin-left:2px;">消息</span></template>
            <el-menu-item index="userComment"> <i class="el-icon-chat-round"></i>评论 </el-menu-item>
            <el-menu-item index="userLike">
              <el-icon>
                <Star />
              </el-icon>
              喜欢和赞
            </el-menu-item>
            <el-menu-item index="userLikeUser"> <i class="el-icon-user"></i>关注 </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main class="vv-main">
        <div class="vv-main-title">
          <span>{{ activeTitle[activeIndex] }}</span>
        </div>
        <notification-list :notification_type="notification_type"></notification-list>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '../setting/index.scss'
import NotificationList from './notification-list'

import IconLikeOutlined from '~icons/ant-design/like-outlined'
export default {
  name: 'NotificationIndex',
  components: { NotificationList },
  data() {
    return {
      activeIndex: '',
      activeTitle: {
        userLike: '收到的喜欢和赞',
        userComment: '收到的评论',
        userLikeUser: '全部关注',
      },
      notificationType: {
        userLike: 0,
        userComment: 1,
        userLikeUser: 2,
      },
      notification_type: 1,
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(newVal) {
      this.init()
    },
  },
  methods: {
    init() {
      this.activeIndex = this.$route.params.notification_type
      this.notification_type = this.notificationType[this.activeIndex]
    },
  },
}
</script>

<style lang="scss" scoped>
.vv-header {
  display: none;
}

.vv-aside {
  width: 190px;
  background: #fff;
  overflow: hidden;
  border-right: 1px solid #ebebeb;

  .el-menu-item i.icon-like {
    margin-right: 5px;
    padding-right: 3px;
    padding-left: 3px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
}

.vv-main {
  background: #fff;
  padding: 0px;

  .vv-main-title {
    margin: 20px 0px 0px 20px;

    span {
      line-height: 1.4;
      font-size: 19px;
    }
  }
}


@media (max-width: 600px) {
  .vv-aside {
    display: none;
  }

  .vv-header {
    width: 100%;
    background: #fff;
    display: flex;
  }
}
</style>
