<!--工单预览弹窗-->
<template>
  <el-skeleton style="width: 240px" animated :loading="loading">
    <template slot="template">
      <el-skeleton-item variant="image" style="width: 240px; height: 240px;" />
    </template>
    <template>
      <img id="ticket" :src="src" style="width:794px">
    </template>
  </el-skeleton>
</template>

<script>
import Print from 'print-js';
import TicketApi from '../../api';
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      src: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      TicketApi.printInfo({ id: this.id, }).then((res) => {
        const myBlob = new window.Blob([res,
        ], { type: 'image/jpg', });
        const qrUrl = window.URL.createObjectURL(myBlob);
        this.src = qrUrl;
        this.loading = false;
        this.$nextTick(() => {
          this.onPrint();
        });
      });
    },
    onPrint() {
      const focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);
      Print({
        documentTitle: '工单详情',
        printable: 'ticket',
        type: 'html',
        scanStyles: false,
        onPrintDialogClose: () => {
          clearInterval(focuser);
          this.$emit('done');
        },
        onError: () => {
          clearInterval(focuser);
          this.$emit('done');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
