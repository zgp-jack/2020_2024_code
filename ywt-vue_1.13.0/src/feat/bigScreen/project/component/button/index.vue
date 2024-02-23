<template>
  <button class="button" :class="ButtonClass" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    ButtonClass() {
      return this.type;
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  font-size: 18px;
  font-weight: 400;
  height: 32px;
  cursor: pointer;
}
.default {
  border: 1.5px solid rgba(201, 229, 255, 0.3);
  background: linear-gradient(
    90deg,
    rgba(201, 229, 255, 0.2),
    rgba(201, 229, 255, 0) 50%,
    rgba(201, 229, 255, 0.2)
  );
  color: #c9e5ff;
}
.text {
  background: transparent;
  color: #1890ff;
  border: 0;
}
.info{
background: radial-gradient(#000101, #1f2632, #343958);
border: 1.5px solid #1890ff;
color:rgba(24,144,255,1)
}
</style>
