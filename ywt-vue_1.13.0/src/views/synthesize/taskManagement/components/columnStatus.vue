<!--  -->
<template>
  <span :style="`color:${textInfo.color}`">
    {{
      textInfo.text
    }}
  </span>

</template>

<script>
import { taskKeyColorConfig, } from '../mixins/index.mixin';

export default {
  name: 'HyyColumnStatus',
  components: {

  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
    state: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    textInfo() {
      const state = String(this.state);

      if (state !== '1') {
        return {
          text: taskKeyColorConfig[state || '0']?.text,
          color: taskKeyColorConfig[state || '0']?.color || '#ad09ff',
        };
      }
      if (this.value > 0 && this.value !== 100) {
        return {
          text: '处理中',
          color: '#67C23A',
        };
      } else {
        return {
          text: taskKeyColorConfig[state || '0']?.text,
          color: taskKeyColorConfig[state || '0']?.color || '#ad09ff',
        };
      }
    },
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang='scss' scoped>
</style>
