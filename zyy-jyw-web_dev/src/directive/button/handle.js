export default {
  bind(el, binding, vnode) {

  },
  update(el, binding, vnode) {
    if (binding.value.match.includes(binding.value.value)) {
      el.remove();
    }
  },
};

