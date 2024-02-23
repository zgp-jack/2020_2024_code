import Vue from 'vue';
import SvgIcon from '../components/svgIcon';
Vue.component('svg-icon', SvgIcon);
const svgFiles = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(svgFiles);
