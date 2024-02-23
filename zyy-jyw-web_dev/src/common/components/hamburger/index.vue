<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg-icon
      icon-class="fold"
      :class="{'is-active':isActive}"
      class="hamburger"
    />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick');
    },
  },
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
