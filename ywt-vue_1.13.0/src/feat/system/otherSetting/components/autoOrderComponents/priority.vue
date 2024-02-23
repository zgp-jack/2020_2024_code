<template>
  <div>
    <el-table :data="data">
      <el-table-column label="派单模式" prop="label" />
      <el-table-column label="优先级" prop="value">
        <template #default="{row,}">
          <el-select v-model="row.value" clearable :disabled="!isAutoDispatch">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disabledValue.includes(item.value)"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-button :disabled="!isAutoDispatch" @click="onConfirm">应用</el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, } from 'vuex';
export default {
  components: {

  },
  data() {
    return {

      data: [{
        mode: 'dept',
        label: '报修科室',
        value: 1,

      }, {
        mode: 'faultType',
        label: '故障分类',
        value: 2,

      }],
      options: [{
        value: 1,
        label: 'P1',
      }, {
        value: 2,
        label: 'P2',
      }],
    };
  },
  watch: {
    dispatchModeData: {
      handler(val) {
        this.data = val.rulePri ? JSON.parse(val.rulePri) : this.data;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('systemOtherSetting/autoOrder', ['dispatchModeData']),
    ...mapGetters('systemOtherSetting/autoOrder', ['isAutoDispatch']),

    disabledValue() {
      return this.data.map(item => item.value);
    },
  },
  methods: {
    ...mapActions('systemOtherSetting/autoOrder', ['SET_DISPATCH_MODE_DATA']),

    onConfirm() {
      const data = {
        ...this.dispatchModeData,
      };
      data.rulePri = JSON.stringify(this.data);
      console.log(data);
      // console.log();
      // return;
      this.SET_DISPATCH_MODE_DATA(data);
    },
  },
};
</script>

<style>

</style>
