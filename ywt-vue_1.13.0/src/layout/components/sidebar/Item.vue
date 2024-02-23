<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:56:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 18:11:23
 * @Description:
-->
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const { icon, title, } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>);
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>);
    }
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
