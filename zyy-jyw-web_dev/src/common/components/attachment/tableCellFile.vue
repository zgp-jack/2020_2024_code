<template>
  <div class="icon-cell-wrapper">
    <span v-if="data.length > 0" @click="showFileDialog">
      <img class="icon-img" :src="file" alt="">
    </span>
    <span v-else>-</span>
    <el-dialog :title="'附件'" :width="'35%'" :visible.sync="visible" @close="visible = false">
      <Attachment :data="data" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Attachment from '@/common/components/attachment/attachment.vue';
export default {
  components: {
    Attachment,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      file: require('@/assets/file/file.svg'),
    };
  },
  methods: {
    showFileDialog() {
      if (this.data.length > 0) {
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
.icon-cell-wrapper{
  cursor: pointer;
}
</style>
