/**
* @file baseInfo.vue
* @author huang
* @date 2023/10/27
* @description  新增资产-基础信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item
      :span="2"
      label="资产名称"
    >
      {{ form.name }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="规格型号"
    >
      {{ form.model }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="资产类型"
    >
      {{ form.assetsTypeToName }}

    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="资产来源"
    >
      {{ form.assetsSourceToName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="1"
      label="设备状态"
    >
      {{ form.equipmentStateToName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="所属巡检单元"
    >
      {{ form.pertainUnitName }}

    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="公共设备"
    >
      {{ pubilcObj[form.isPublic] }}

    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="使用责任人"
    >
      {{ form.personLiableName }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="所在位置"
    >
      {{ form.place }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="备注"
    >
      {{ form.remark }}
    </el-descriptions-item>
    <el-descriptions-item
      :span="2"
      label="附件"
    >
      <pure-attachment-list :data="form.enclosure" />
    </el-descriptions-item>

  </el-descriptions>
</template>
<script>
import { pick, } from 'lodash-es';

export default {
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      pubilcObj: {
        1: '是',
        0: '否',
      },
      form: {
        name: '',
        model: '',
        assetsTypeToName: '',
        assetsSourceToName: '',
        pertainUnitName: '',
        isPublic: 1,
        personLiableName: '',
        place: '',
        remark: '',
        enclosure: [],
        equipmentStateToName: '',
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        console.log(val, 'vbal');
        if (val) {
          const d = pick(val, Object.keys(this.form));
          d.enclosure = d.enclosure || [];
          this.form = {
            ...d,
          };
        }
      },
      deep: true,
    },
  },
  methods: {
    async submit() {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (e) {
        valid = e;
      }
      return {
        valid,
        form: this.form,
      };
    },
  },
};

</script>
<style lang='scss'
  scoped
>

</style>
