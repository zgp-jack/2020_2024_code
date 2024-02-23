/**
* @file serviceDesk.vue
* @author huang
* @date 2023/8/31
* @description  服务台情况
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <chart-panel title="服务台情况">

    <pure-table>
      <el-table-column
        align="left"
        label="序号"
        type="index"
        width="80"
      />
      <el-table-column
        align="left"
        label="姓名"
        prop="name"
      />
      <el-table-column
        align="left"
        label="电话总数"
        prop="phoneNum"
      />
      <el-table-column
        align="left"
        label="接听率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="answerNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="answerProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="已接未建单率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="noCreateNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="noCreateProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="电话解决率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="makeNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="makeProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="建单率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="createNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="createProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="派单率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="transferNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="transferProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="无效电话率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="invalidNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="invalidProp"
        />
      </el-table-column>
      <el-table-column
        align="left"
        label="电话找人率"
      >
        <el-table-column
          align="left"
          label="数量"
          prop="lookNum"
        />
        <el-table-column
          align="left"
          label="占比"
          prop="lookProp"
        />
      </el-table-column>
    </pure-table>
  </chart-panel>

</template>

<script>
import ChartPanel from '../panel/index.vue';
// import StatisticalAnalysisApi from '../api';
// import { downloadFile, } from '@/common/utils/download';
export default {
  components: {
    ChartPanel,
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
