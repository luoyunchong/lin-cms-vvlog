<template>
  <div class="comments-item">
    <div class="pull-left">
      <img class="avatar-32" :src="avatar" alt v-if="avatar" @click="handleClickAvatar" />
    </div>
    <div class="comments-box">
      <div class="comments-trigger">
        <div class="pull-right comments-option">
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
        </div>
        <strong>
          <a target="_blank" href="javascript:void(0)" @click="handleClickAuthor">{{author}}</a>
        </strong>
        <span class="comments-date">· {{time | filterTime}}</span>
      </div>
      <div class="comments-content">
        <p>{{content}}</p>
      </div>
      <p class="comments-ops">
        <span
          class="coments-ops-item ml15"
          v-for="item in ops"
          :key="item.name"
          @click="()=>item.click()"
        >
          <i :class="item.icon + ' coments-ops-icon'" v-if="item.icon"></i>
          <span class="coments-ops-text">{{item.count}}</span>
        </span>
        <span class="comments-reply-btn ml15" @click="handleAddReply">
          <i class="iconfont icon-comment coments-ops-icon"></i>
          回复
        </span>
      </p>
      <div class="reply-list" v-show="hasReply">
        <slot></slot>
        <!-- <div class="reply-item reply-item--ops">
          <a class="reply-inner-btn" href="javascript:void(0);" @click="handleAddReply">添加回复</a>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    avatar: String,
    author: String,
    content: String,
    ops: Array,
    tools: Array,
    time: [String, Number],
    hasReply: Boolean
  },
  data() {
    return {};
  },
  computed: {},
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
    }
  },
  filters: {
    filterTime(value) {
      if (!value) {
        return "未知时间";
      }
      if (Object.prototype.toString.call(value) === "[object String]") {
        return value;
      }
      if (value === "" || isNaN(value)) {
        return "未知时间";
      }
      if (value <= 0) {
        return "未知时间";
      }
      if (value < 10000000000) {
        value *= 1000;
      }
      let time = new Date(value);
      let tY = time.getFullYear();
      let tM =
        time.getMonth() + 1 < 10
          ? "0" + (time.getMonth() + 1)
          : time.getMonth() + 1;
      let tD = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      let th = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      let tm =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      let ts =
        time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
      let now = new Date();
      let nY = now.getFullYear();
      let nM =
        now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1;
      let nD = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      let result = "";
      if (tY !== nY) {
        result += tY + "年";
      }
      if (tM !== nM || tD !== nD) {
        result += tM + "月";
        result += tD + "日";
      }
      if (result === "") {
        result = th + ":" + tm + ":" + ts;
      }
      return result;
    }
  }
};
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
  .coments-ops-item,
  .comments-reply-btn {
    &:hover {
      cursor: pointer;
      color: #5cb6ff;
    }
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
  content: "";
  clear: both;
}
.comments-ops {
  margin: 0;
  color: #999;
  font-size: 13px;
}
.comments-reply-btn {
  cursor: pointer;
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
