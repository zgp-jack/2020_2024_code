<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:57:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 16:57:21
 * @Description:
-->
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal, } from '@/utils/validator';

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return 'a';
      }
      return 'router-link';
    },
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        };
      }
      return {
        to: to,
      };
    },
  },
};
</script>
