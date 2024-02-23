<template>
  <div class="icon-cell-wrapper" @click="showFileDialog">
    <el-badge :value="FileNum">
      <img class="icon-img" :src="file" alt="">
    </el-badge>
    <Dialog :visible="visible" :title="'附件'" @close="visible = false">
      <Attachment :data="data" />
    </Dialog>
  </div>
</template>

<script>
import Dialog from '../dialog/index.vue';
import { stringifyToArr, } from '@/filters';
import Attachment from '@/views/project/components/attachment/attachment.vue';
export default {
  components: {
    Dialog,
    Attachment,
  },
  props: {
    data: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      file: require('@/assets/project/icons/file.svg'),
    };
  },
  computed: {
    FileNum() {
      return stringifyToArr(this.data).length || '';
    },
  },
  methods: {
    showFileDialog() {
      // this.visible = true;

      if (this.FileNum) {
        this.visible = true;
      } else {
        this.$message.warning('无数据！');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon{
  &-img{
    width: 16px;
    height: 16px;
  }

}
</style>
