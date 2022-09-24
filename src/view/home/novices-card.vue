<template>
  <div>
    <el-card
      :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }"
      shadow="never"
      class="lin-card"
      v-loading="loading"
    >
      <template #header>
        <div class="card-header">
          <span class="lin-title">新手</span>
        </div>
      </template>
      <div>
        <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px">
          <!-- <router-link :to="{ path: `/user/${item.id}/article` }" -->
          <template v-for="(item, index) in users" :key="index">
            <el-col :sm="4" :xs="4" :md="6" :lg="6" :xl="6">
              <el-popover
                placement="top-start"
                :width="360"
                trigger="hover"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
              >
                <el-card shadow="never" style="border: none" :body-style="{ padding: '10px' }">
                  <router-link :to="{ path: `/user/${item.id}/article` }">
                    <div class="avatar-mid">
                      <el-avatar
                        @error="
                          () => {
                            return true
                          }
                        "
                        shape="square"
                        :size="77"
                        :src="item.avatar"
                      >
                        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                      </el-avatar>
                    </div>
                  </router-link>
                  <div class="user-card__meta">
                    <div class="fn__ellipsis">
                      <router-link :to="{ path: `/user/${item.id}/article` }" class="user-card__name">
                        <b>{{ item.nickname }}</b>
                      </router-link>
                      <router-link class="ft-gray ft-smaller" :to="{ path: `/user/${item.id}/article` }">
                        <b>{{ item.username }}</b>
                      </router-link>
                    </div>
                    <div class="user-card__info" v-if="item.introduction">
                      {{ item.introduction }}
                    </div>
                    <div class="user-card__info" v-else-if="item.create_time != 0">
                      <span class="ft-gray">{{ $filters.filterTime(item.create_time) }}</span>
                      加入
                    </div>
                    <div class="user-card__info" v-if="item.last_login_time != 0">
                      最后登录
                      <span class="ft-gray">{{ $filters.filterTimeYmdHms(item.last_login_time) }}</span>
                    </div>
                  </div>
                </el-card>
                <template #reference>
                  <router-link :to="{ path: `/user/${item.id}/article` }">
                    <el-avatar
                      @error="
                        () => {
                          return true
                        }
                      "
                      style="margin: 15px 7.5px 0"
                      shape="square"
                      :size="38"
                      :src="item.avatar"
                    >
                      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                    </el-avatar>
                  </router-link>
                </template>
              </el-popover>
            </el-col>
          </template>
          <!-- </router-link> -->
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import userApi from '@/lin/model/user'
export default {
  name: 'NovicesCard',
  data() {
    return { users: [], loading: false }
  },
  async created() {
    await this.getNovices()
  },
  methods: {
    async getNovices() {
      this.loading = true
      this.users = await userApi.getNovices().finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped lang="scss">
.lin-card {
  margin-bottom: 10px;
  border-radius: 8px;

  .lin-title {
    margin-bottom: 1rem;
    padding: 0 0 0 0.5rem;
    color: #000;
    border-left: 4px solid #ec7259;
  }
}
.el-popover {
  width: 300px;
}

.avatar-mid {
  height: 77px;
  width: 77px;
  position: absolute;
  top: -39px;
  background-color: hsla(0, 0%, 100%, 0.8);

  .avatar-mid-img {
    border-radius: 4px;
  }
}

.fn__ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;

  .user-card__name {
    color: #000;
    font-size: 18px;
    line-height: 22px;
    margin-left: 92px;
    margin-right: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.ft-gray {
  color: rgba(0, 0, 0, 0.54);
}

.ft-smaller {
  font-size: 12px;
  line-height: 16px;

  &:hover {
    text-decoration: underline;
  }
}

.user-card__info {
  margin: 8px 0;
  line-height: 18px;
  font-size: 14px;
  min-height: 18px;
  overflow: hidden;
}
</style>