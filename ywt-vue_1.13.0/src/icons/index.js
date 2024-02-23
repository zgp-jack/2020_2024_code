/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 18:03:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 18:03:28
 * @Description:
 */
import Vue from 'vue';
import SvgIcon from '@/components/svgIcon';// svg component

// register globally
Vue.component('svg-icon', SvgIcon);

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
