<template>
  <div class="vv-list-item">
    <div class="vv-list-item-extra-wrap" v-if="extra||$slots.extra">
      <div class="vv-list-item-main">
        <slot></slot>
        <div class="vv-list-item-content" v-if="content|| $slots.content">
          <slot name="content"></slot>
        </div>
        <ul class="vv-list-item-action">
          <slot name="actions"></slot>
          <!-- <em class="vv-list-item-action-split" /> -->
        </ul>
      </div>
      <div class="vv-list-item-extra">
        <slot name="extra">{{extra}}</slot>
      </div>
    </div>
    <template v-else>
      <slot></slot>
      <div class="vv-list-item-content" v-if="content|| $slots.content">
        <slot name="content"></slot>
      </div>
      <ul class="vv-list-item-action">
        <slot name="actions"></slot>
        <!-- <em class="vv-list-item-action-split" /> -->
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: "VListItem",
  props: {
    extra: String,
    content: String
  },
  computed: {
    otherContent() {
      let content = [];
      ($slots.default || []).forEach(element => {
        if (typeof item === "string") {
          content.push(element);
        }
      });

      return content;
    },
    isItemContainsTextNode() {
      let result;
      this.$slots.default.forEach(item => {
        if (typeof item === "string") {
          result = true;
        }
      });
      return result;
    },
    isFlexMode() {
      const extra = this.$slots.extra;
      if (this.itemLayout === "vertical") {
        return !!extra;
      }
      return !this.isItemContainsTextNode;
    },
    classes() {
      return [
        {
          "vv-list-item-no-flex": !this.isFlexMode
        }
      ];
    }
  }
};
</script>

<style>
</style>