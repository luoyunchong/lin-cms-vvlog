<template>
  <div class="vv-list-item-extra-wrap">
    <div class="vv-list-item-main">
      <ul class="vv-list-item-action" v-for="(item,i) in actions" v-bind:key="i">
        <li :key="'vv-list-item-action-'+i">
          {action}
          <em v-if="i!==actions.length-1" class="vv-list-item-action-split" />
          <!-- {i !== actions.length - 1 && <em class={`${prefixCls}-item-action-split`} />} -->
        </li>
      </ul>
    </div>
    <div class="vv-list-item-extra">
      <slot name="extra">{{extra}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "VListItem",
  props: {
    actions: [Array],
    extra: String
  },
  computed: {
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
          "ivu-list-item-no-flex": !this.isFlexMode
        }
      ];
    }
  }
};
</script>

<style>
</style>