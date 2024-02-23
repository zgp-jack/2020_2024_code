<!--  -->
<template>
  <el-popover
    placement="bottom"
    title=""
    width="400"
    trigger="hover"
    :close-delay="100"
  >
    <ul class="info_wrapper">
      <li class="info-li">
        <span class="title-span"> 项目名称 </span>
        <span class="content-span">
          {{ info.title }}
        </span>
      </li>
      <li class="info-li">
        <span class="title-span"> 项目描述 </span>
        <span class="content-span">
          {{ info.remark || '-' }}
        </span>
      </li>
    </ul>
    <DemandOrProjectName slot="reference" :data="info" />
  </el-popover>
</template>

<script>
import { textOmit, } from '@/utils/common';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';

export default {
  components: {
    DemandOrProjectName,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return textOmit(this.info.title);
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.info_wrapper {
  padding: 0;
  margin: 0;
  list-style: none;
  > .info-li {
    display: flex;
    > .title-span {
      font-size: 18px;
      font-weight: 400;
      color: #7d8db3;
      white-space: nowrap;
    }
    > .content-span {
      font-size: 18px;
      font-weight: 400;
      color: #334266;
      display: inline-block;
      margin-left: 8px;
      flex: 1;
    }
  }
}
</style>
