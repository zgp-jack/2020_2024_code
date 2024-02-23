<!-- 新增巡检单元 -->
<template>
  <div class="addUnit">
    <div style="margin-bottom: 20px;">
      {{ istitle === 1 ? '编辑巡检单元' : '新增巡检单元' }}
    </div>
    <patrolUnitInformation ref="addUnit" style="flex:1;" :isdisabled="false" :isexpand="true" />
    <el-button style="width:80px;margin: 10px 0 20px 0;" type="primary" size="mini" @click="addUnit">保存</el-button>
  </div>
</template>

<script>
import patrolUnitInformation from '@/views/inspection/components/panel/patrolUnitInformation';
import {
  saveOrUpdateUnit,
  saveOrUpdateUnitByPatrol,
} from '@/apis/inspection/InspectionUnit/index';

export default {
  components: {
    patrolUnitInformation,
  },
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'unitData'
  ],
  data() {
    return {
      istitle: 0,
    };
  },
  computed: {

  },
  created() {
    this.istitle = this.unitData.istype;
  },
  methods: {
    addUnit() {
      const data = this.$refs['addUnit'].transferData('fromRules', 'fromRules1');
      console.log(data);
      if (data !== null) {
        if (data.isPatrol === 0) {
          saveOrUpdateUnit(data);
          console.log('不巡检');
        } else {
          saveOrUpdateUnitByPatrol({ json: JSON.stringify(data), });
          console.log('巡检');
        }
        this.$emit('done');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addUnit{
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
