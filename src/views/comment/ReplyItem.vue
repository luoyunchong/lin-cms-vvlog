<template>
  <div>
    <div class="reply-item">
      <div class="pull-left">
        <img class="avatar-32" :src="author.avatar||defaultAvatar" alt @click="handleClickAvatar" />
      </div>
      <div class="reply-content-block">
        <div class="reply-content">
          <p v-html="commentContent"></p>
        </div>
        <div class="comment-func">
          <span class="pull-right comment-tools ml15">
            <a
              href="javascript:void(0)"
              class="ml10"
              data-placement="top"
              :title="item.title"
              v-for="item in tools"
              :key="item.name"
              @click="handleClickTool($event, item)"
            >
              <i :class="item.icon" v-if="item.icon"></i>
              <span v-if="item.text">{{item.text}}</span>
            </a>
          </span>
          <span class="comment-meta inline-block">
            <a
              target="_blank"
              href="javascript:void(0)"
              @click="handleClickAuthor($event)"
            >{{author.nickname}}</a>
            <template v-if="resp_user_info!=null">
              <span style="margin:0px 5px;">回复</span>
              <a target="_blank" href="javascript:void(0)">{{resp_user_info.nickname}}</a>
            </template>
            <span class="comments-date">· {{time | filterTimeYmdHms}}</span>
          </span>
        </div>
      </div>
      <p class="comments-ops">
        <span class="comments-reply-btn ml15" @click="handleAddReply">
          <i class="iconfont icon-comment coments-ops-icon"></i>
          {{replyText}}
        </span>
        <el-popconfirm title="确认删除此评论" @onConfirm="handleDeleteReply" v-show="author.id==user.id">
          <span class="comments-reply-btn ml15" slot="reference">
            <i class="iconfont icon-delete coments-ops-icon"></i>
            删除
          </span>
        </el-popconfirm>
      </p>
      <div class="comment-input" v-show="replyVisible">
        <slot name="reply-item-input"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/img/user/user.png";
import Utils from "@/lin/utils/util";
export default {
  name: "ReplyItem",
  props: {
    author: Object,
    content: String,
    tools: Array,
    time: [String, Number],
    replyVisible: {
      type: Boolean,
      default: false
    },
    resp_user_info: Object
  },
  data() {
    return {
      defaultAvatar
    };
  },
  computed: {
    replyText() {
      return this.replyVisible == true ? "取消回复" : "回复";
    },
    commentContent() {
      return Utils.formatHtml(Utils.formatHyperLink(this.content));
    }
  },
  methods: {
    handleClickAvatar(event) {
      event.stopPropagation();
      this.$emit("clickAvatar", this);
    },
    handleClickTool(event, tool) {
      event.stopPropagation();
      this.$emit("clickTool", this, tool);
    },
    handleClickAuthor(event) {
      event.stopPropagation();
      this.$emit("clickAuthor", this);
    },
    handleAddReply(event) {
      event.stopPropagation();
      this.$emit("addReply", this);
    },
    handleDeleteReply(event) {
      this.$emit("deleteReply", this);
    }
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
.pull-left {
  float: left !important;
}
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.avatar-32:hover {
  cursor: pointer;
}

.ml10 {
  margin-left: 10px !important;
}
.ml15 {
  margin-left: 15px !important;
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  line-height: 1.6;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.09);
  word-break: break-word;
  .reply-content-block {
    margin-bottom: 10px !important;
    padding-left: 47px;
  }
}
.reply-item a {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}
.reply-item a:hover,
.reply-item a:active,
.reply-item a:focus {
  outline: 0;
}
.reply-item p {
  margin-bottom: 5px;
}
.comment-meta {
  color: #999;
}
.inline-block {
  display: inline-block;
}

.comments-ops {
  .coments-ops-item,
  .comments-reply-btn {
    &:hover {
      cursor: pointer;
      color: #5cb6ff;
    }
  }
}
</style>
