/**
* @file consumableInfo.vue
* @author huang
* @date 2023/11/8
* @description  耗材信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item label="耗材名称">
      {{ data.name }}
    </el-descriptions-item>
    <el-descriptions-item label="规格型号">
      {{ data.model }}
    </el-descriptions-item>
    <el-descriptions-item label="供应商">
      {{ data.supplierName || '-' }}
    </el-descriptions-item>
    <el-descriptions-item label="分类">
      {{ data.typeToName }}
    </el-descriptions-item>
    <el-descriptions-item label="使用单位">
      {{ data.unitToName }}
    </el-descriptions-item>
    <el-descriptions-item label="单价">
      {{ data.price }}
    </el-descriptions-item>
    <el-descriptions-item label="安全库存">
      {{ data.safeReserve }} {{ data.unitToName }}
    </el-descriptions-item>
    <el-descriptions-item label="当前库存">
      {{ data.realReserve }} {{ data.unitToName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="备注"
    >
      {{ data.remark }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="附件"
    >
      <pure-attachment-list :data="data.enclosure" />
    </el-descriptions-item>

  </el-descriptions>
</template>
<script>

export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          name: '',
          model: '',
          supplierName: '',
          typeToName: '',
          unitToName: '',
          price: '',
          safeReserve: '',
          realReserve: '',
          remark: '',
          enclosure: [],
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang='scss'
  scoped
>

</style>
