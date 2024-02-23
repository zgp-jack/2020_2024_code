<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-14 12:00:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-14 14:23:44
 * @Description:
-->
<script>
export default {
  created() {
    const { params, query, } = this.$route;
    const { path, } = params;
    console.log(path);
    console.log('----------------');
    this.$router.replace({ path: '/' + path, query, });
  },
  render: function (h) {
    console.log('h');
    return h(); // avoid warning message
  },
};
</script>
