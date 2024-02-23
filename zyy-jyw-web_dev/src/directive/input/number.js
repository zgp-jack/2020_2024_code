export default {
  bind(el, binding, vnode) {
    const input = el.querySelector('input');
    input.addEventListener('input', function (event) {
      const val = event.target.value;
      console.log(val);
      event.target.value = val.replace(/\D/g, '');
    });
  },
  update(el, binding, vnode) {
    // const input = el.querySelector('input');
    // input.addEventListener('input', function (event) {
    //   const val = event.target.value;
    //   console.log(val);
    // });
  },
};
