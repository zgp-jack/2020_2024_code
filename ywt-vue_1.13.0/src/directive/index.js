/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 20:46:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 20:47:00
 * @Description:
 */
import { formatNumber, } from '@/utils/common';
import Vue from 'vue';

const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 3000);// 传入绑定值就使用，默认3000毫秒内不可重复触发
      }
    });
  },
});

const inputNumber = Vue.directive('inputNumber', {
  bind(el, binding, vNode) {
    el.onkeypress = (event) => {
      return (/[.\d.]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
    };
    el.oninput = () => {
      el.children[0].value = formatNumber(el.children[0].value, true, false);
    };
  },
});

export default { preventReClick, inputNumber, };
