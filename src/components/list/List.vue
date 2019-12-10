<template>
  <div :class="classString">
    <div class="vv-list-header" v-if="header|| $slots.header">
      <slot name="header">{{ header }}</slot>
    </div>
    <template v-for="(item,index) in dataSource">
      <slot name="renderItem" :item="item" :index="index"></slot>
    </template>
    <div class="vv-list-footer" v-if="footer || $slots.footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
<script>
const prefixCls = "vv-list";

export default {
  name: "VList",
  provide() {
    return {
      ListInstance: this
    };
  },
  data() {
    this.keys = [];
    this.defaultPaginationProps = {
      current: 1,
      pageSize: 10,
      onChange: (page, pageSize) => {
        const { pagination } = this;
        this.paginationCurrent = page;
        if (pagination && pagination.onChange) {
          pagination.onChange(page, pageSize);
        }
      },
      total: 0
    };
    return {
      paginationCurrent: 1
    };
  },
  props: {
    header: String,
    footer: String,
    dataSource: {
      type: Array,
      default: []
    },
    bordered: {
      type: Boolean,
      default: false
    },
    itemLayout: {
      default: "horizontal" //horizontal或vertical
    },
    size: {
      type: String,
      default() {
        return "large"; //large 、small
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    split: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classString() {
      // large => lg
      // small => sm
      let sizeCls = "";
      switch (this.size) {
        case "large":
          sizeCls = "lg";
          break;
        case "small":
          sizeCls = "sm";
          break;
        default:
          break;
      }
      return [
        `${prefixCls}`,
        `${prefixCls}-${sizeCls}`,
        `${prefixCls}-${this.itemLayout}`,
        {
          [`${prefixCls}-bordered`]: this.bordered,
          [`${prefixCls}-split`]: this.split
        }
      ];
    }
  }
};
</script>

<style>
</style>