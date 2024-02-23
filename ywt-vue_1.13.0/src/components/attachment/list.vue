<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-13 16:08:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:54:54
 * @Description:附件列表
-->
<template>
  <div class="container">
    <div v-for="(item,index) in list" :key="index" class="item">
      <svg-icon :icon-class="getIconClass(item.url)" />
      <a v-ellipsis.end target="_blank" class="name" data-ellipsis="..." :href="$store.state['login'].uriConfig.fileBaseUri+item.url">{{ item.name }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttachmentList',
  props: {
    /**
     * 附件列表
     */
    list: {
      type: Array,
      default: () => [],
    },
    /**
     * 排列方向 horizontal:水平，vertical:垂直
     */
    direction: {
      type: String,
      default: 'horizontal ',
    },
  },
  data() {
    return {

    };
  },
  methods: {
    getIconClass(fileName) {
      if (this.isExcel(fileName)) {
        return 'excel';
      }
      if (this.isImage(fileName)) {
        return 'image';
      }
      if (this.isZip(fileName)) {
        return 'zip';
      }
      if (this.isTxt(fileName)) {
        return 'txt';
      }
      if (this.isPdf(fileName)) {
        return 'pdf';
      }
      return 'file';
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file);
    },
    isImage(file) {
      return /\.(png|jpg|jpeg|gif|bmp)$/.test(file);
    },
    isZip(file) {
      return /\.(zip|rar)$/.test(file);
    },
    isTxt(file) {
      return /\.(txt)$/.test(file);
    },
    isPdf(file) {
      return /\.(pdf)$/.test(file);
    },
  },

};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 25%;
  display: flex;
  padding-right:10px;
  margin-bottom: 20px;
 .name {
    margin-left: 10px;
    flex:1;
 }
}
</style>
