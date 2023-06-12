<template>
  <div :class="classString">
    <div class="vv-list-header" v-if="header || $slots.header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="vv-list-pagination" v-if="pagination && (pagination.position == 'top')">
      <el-pagination class="pagination" v-if="pagination" :background="pagination.background ? pagination.background : false"
        :small="pagination.small ? pagination.small : false" layout="prev, pager, next, jumper"
        :page-size="pagination.pageSize ? pagination.pageSize : 10" :total="pagination.count ? pagination.count : null"
        @current-change="currentChange" :current-page="pagination.currentPage"></el-pagination>
    </div>
    <template v-for="(item, index) in dataSource">
      <slot name="renderItem" :item="item" :index="index"></slot>
    </template>
    <el-empty :description="emptyText" v-if="dataSource.length == 0" />
    <div class="vv-list-footer" v-if="footer || $slots.footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
    <div class="vv-list-pagination" v-if="pagination && (pagination.position == 'bottom')">
      <el-pagination class="pagination" v-if="pagination" :background="pagination.background ? pagination.background : false"
        :small="pagination.small ? pagination.small : false" layout="prev, pager, next, jumper"
        :page-size="pagination.pageSize ? pagination.pageSize : 10" :total="pagination.count ? pagination.count : null"
        @current-change="currentChange" :current-page="pagination.currentPage"></el-pagination>
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
    emptyText: {
      type: String,
      default: '暂无数据'
    },
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
    },
    pagination: {
      type: [Boolean, Object],
      default: false
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
  },
  methods: {
    // 切换当前页
    currentChange(page) {
      this.pagination.currentChange(page);
    }
  }
};
</script>

<style scoped></style>
