<template>
  <div class="vv-list-item-meta">
    <div class="vv-list-item-meta-avatar" v-if="avatar || $slots.avatar">
      <slot name="avatar">{{ avatar }}</slot>
    </div>
    <div class="vv-list-item-meta-content">
      <h4 class="vv-list-item-meta-title" v-if="title || $slots.title">
        <slot name="title">{{ title }}</slot>
      </h4>
      <div class="vv-list-item-meta-description" v-if="description||$slots.description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VListItemMeta",
  props: {
    avatar: String,
    description: String,
    title: String
  },
  computed: {
    prefixCls() {
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>