<template>
  <div class="comments-item">
    <div class="pull-left">
      <img class="avatar-32" :src="author.avatar || defaultAvatar" alt="default" @click="handleClickAvatar" />
    </div>
    <div class="comments-box">
      <div class="comments-trigger">
        <div class="pull-right comments-option">
          <a href="javascript:void(0)" class="ml10" data-placement="top" :title="item.title" v-for="item in tools"
            :key="item.name" v-show="item.is_audit" @click="handleClickTool($event, item)">
            <i :class="item.icon" v-if="item.icon"></i>
            <span v-if="item.text">{{ item.text }}</span>
          </a>
        </div>
        <strong>
          <router-link v-if="author.id != 0" :to="{ path: `/user/${author.id}/article` }" target="_blank"
            @click="handleClickAuthor">{{ author.nickname }}</router-link>
          <a v-if="author.id == 0" @click="handleClickAuthor">{{ author.nickname }}</a>
        </strong>
        <span class="comments-date">· {{ $filters.filterTimeYmdHms(time) }}</span>
      </div>
      <div class="comments-content">
        <p v-html="commentContent"></p>
      </div>
      <p class="comments-ops">
        <span class="comments-reply-btn ml15" @click="handleAddReply" v-show="isAudit">
          <el-icon>
            <Comment />
          </el-icon>
          {{ replyText }}
        </span>
        <template v-show="user != null && author.id == user.id">
          <el-popconfirm :width="200" :title="hasReply ? '删除评论后，评论下的所有回复都会被删除!' : '确认删除此评论'"
            @confirm="handleDeleteReply">
            <template #reference>
              <span class="comments-reply-btn ml15">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </span>
            </template>
          </el-popconfirm>

        </template>
      </p>
      <div class="comment-input" v-show="replyVisible">
        <slot name="comment-input"></slot>
      </div>
      <div class="reply-list" v-show="hasReply">
        <slot name="reply-list"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '@/lin/util/util'
import defaultAvatar from '@/assets/image/user/user.png'
export default {
  name: 'CommentItem',
  props: {
    avatar: String,
    author: {
      type: Object,
    },
    content: String,
    tools: Array,
    time: [String, Number],
    hasReply: Boolean,
    replyVisible: {
      type: Boolean,
      default: false,
    },
    isAudit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // replyVisible: false
      defaultAvatar,
    }
  },
  computed: {
    replyText() {
      return this.replyVisible == true ? '取消回复' : '回复'
    },
    commentContent() {
      return Utils.formatHtml(Utils.formatHyperLink(this.content))
    },
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    handleClickAvatar(event) {
      event.stopPropagation()
      this.$emit('clickAvatar', this)
    },
    handleClickTool(event, tool) {
      event.stopPropagation()
      this.$emit('clickTool', this, tool)
    },
    handleClickAuthor(event) {
      event.stopPropagation()
      this.$notify({
        title: '警告',
        message: '该用户已被系统删除·',
        type: 'warning',
      })
      this.$emit('clickAuthor', this)
    },
    handleAddReply(event) {
      event.stopPropagation()
      this.$emit('addReply', this)
    },
    handleDeleteReply(event) {
      this.$emit('deleteReply', this)
    },
  },
  filters: {},
}
</script>

<style lang="scss" scoped>
img {
  border: 0;
  vertical-align: middle;
}

.ml10 {
  margin-left: 10px !important;
}

.ml15 {
  margin-left: 15px !important;
}

.comments-item {
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  font-size: 14px;
}

.pull-left {
  float: left !important;
}

.pull-right {
  float: right !important;
}

.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.avatar-32:hover {
  cursor: pointer;
}

.comments-item a {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}

.comments-item a:hover,
.comments-item a:active,
.comments-item a:focus {
  outline: 0;
}

.comments-box {
  padding-left: 47px;
}

.comments-box strong {
  font-weight: bold;
}

.comments-trigger {
  margin-bottom: 10px;
  color: #999;
  font-size: 13px;
}

.comments-ops {
  .comments-reply-btn:hover {
    cursor: pointer;
    color: #5cb6ff;
  }
}

.comments-content {
  line-height: 1.6;
  word-wrap: break-word;
  margin-bottom: 10px !important;
}

.comments-content::before,
.comments-content::after {
  display: table;
}

.comments-content::after {
  content: '';
  clear: both;
}

.comments-ops {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.comments-reply-btn {
  color: #999;
  cursor: pointer;
}

.comment-input {
  margin-top: 1.083rem;
  position: relative;
  padding: 1rem 1rem 0rem 1rem;
  background-color: #fafbfc;
  border-radius: 3px;
}

.reply-list {
  margin-top: 10px;
  font-size: 13px;
  background-color: #fafafa;
  padding: 0 10px;
  color: #666;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}

.reply-item--ops {
  border-bottom: none;
}

.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  word-break: break-word;
}
</style>
