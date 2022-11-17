<template>
  <div class="padding">
    <lin-table :fixed="false" :tableColumn="tableColumn" :tableData="tableData" :operate="operate" @handleEdit="handleEdit"
      v-loading="loading">
      <template #create_time="scope">
        <span>{{ $filters.filterTimeYmdHms(scope.row.create_time) }}</span>
      </template>
    </lin-table>
    <div class="margin-top oauth2">
      <el-card>
        <template #header>
          <span>你还可以绑定以下第三方帐号</span>
        </template>
        <div class="margin-top">
          <a href="javascript:void(0);" @click="() => bind('GitHub')" v-if="showGitHub">
            <el-avatar class="margin-left-xs" title="github登录" :size="40">
              <AntDesignGithubOutlined width="27" height="27.2" />
            </el-avatar>
          </a>
          <a href="javascript:void(0);" @click="() => bind('QQ')" v-if="showQQ">
            <el-avatar class="margin-left-xs" title="qq登录" :size="40">
              <AntDesignQqOutlined width="27" height="27.2" />
            </el-avatar>
          </a>
        </div>
      </el-card>
    </div>
  </div>
</template>

//
<a href="javascript:void(0);" @click="() => bind('Gitee')" v-if="showGitee">
          //   <el-avatar
          //     class="margin-left-xs"
          //     icon="iconfont icon-gitee-fill-round"
          //     title="码云登录"
          //     size="large"
          //   ></el-avatar>
          // </a>
<script>
import oauth2 from '@/model/oauth2'
import { getToken } from '@/lin/util/token'
import LinTable from '@/component/base/table/lin-table'
import AntDesignQqOutlined from '~icons/ant-design/qq-outlined'
import AntDesignGithubOutlined from '~icons/ant-design/github-outlined'
export default {
  data() {
    return {
      tableData: [],
      tableColumn: [],
      operate: [],
      loading: false,
      showGitee: true,
      showGitHub: true,
      showQQ: true,
    }
  },
  components: { LinTable, AntDesignQqOutlined, AntDesignGithubOutlined },
  async created() {
    this.tableColumn = [
      { prop: 'identity_type', label: '绑定帐号信息' },
      { prop: 'identifier', label: '详情' },
      {
        prop: 'create_time',
        label: '绑定时间',
        scopedSlots: { customRender: 'create_time' },
      },
    ]
    this.operate = [{ name: '解除绑定', func: 'handleEdit', type: 'primary' }]
    this.bindlist()
  },
  methods: {
    // 'https://github.com/login/oauth/authorize?client_id=0be6b05fc717bfc4fb67&state=github&redirect_uri=https://localhost:5001/signin-github',
    bind(provider) {
      var t = window.open(
        `${process.env.VUE_APP_BASE_URL}cms/oauth2/signin-bind?provider=${provider}&redirectUrl=${process.env.VUE_APP_CURRENT_URL
        }&token=${getToken('access_token')}`,
        '_blank',
        'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=600',
      )
      var n = window.setInterval(function () {
        ; (t && !t.closed) || (window.clearInterval(n), window.location.reload())
      }, 300)
    },
    async bindlist() {
      var that = this
      this.loading = true
      that.showGitHub = true
      that.showGitee = true
      that.showQQ = true

      this.tableData = await oauth2.bindlist()
      this.tableData.forEach(r => {
        if (r.identity_type == 'GitHub') {
          that.showGitHub = false
          return
        }
        if (r.identity_type == 'Gitee') {
          that.showGitee = false
          return
        }
        if (r.identity_type == 'QQ') {
          that.showQQ = false
          return
        }
      })

      this.loading = false
    },
    async handleEdit(val) {
      var that = this
      this.$confirm('解绑后将无法使用该第三方帐号登录!!!', `确认要解绑${val.row.identity_type}?`).then(async () => {
        await oauth2.unbind(val.row.id)
        that.bindlist()
        this.$message.success(`解绑成功！`)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.oauth2 {
  .el-avatar :deep(i) {
    font-size: 27px !important;

    &:hover {
      cursor: pointer !important;
    }
  }
}
</style>
