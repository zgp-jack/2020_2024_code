<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-06-23 16:10:43
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-06-29 15:30:52
 * @FilePath: \ywt-vue\src\feat\system\otherSetting\components\mandatoryInfo.vue
 * @Description: 报修信息必填项配置
-->
<template>
  <div class="mandatory-box">
    <div>
      <span class="title">报修电话:</span>
      <el-radio-group v-model="repair_phone" @change="changeRadio($event,'repair_phone')">
        <el-radio :label="true">必填</el-radio>
        <el-radio :label="false">非必填</el-radio>
      </el-radio-group>
    </div>
    <div>
      <span class="title">报修人:</span>
      <el-radio-group v-model="repair_user" @change="changeRadio($event,'repair_user')">
        <el-radio :label="true">必填</el-radio>
        <el-radio :label="false">非必填</el-radio>
      </el-radio-group>
    </div>
    <div>
      <span class="title">报修科室:</span>
      <el-radio-group v-model="repair_dept" @change="changeRadio($event,'repair_dept')">
        <el-radio :label="true">必填</el-radio>
        <el-radio :label="false">非必填</el-radio>
      </el-radio-group>
    </div>
    <div>
      <span class="title">报修地址:</span>
      <el-radio-group v-model="repair_place" @change="changeRadio($event,'repair_place')">
        <el-radio :label="true">必填</el-radio>
        <el-radio :label="false">非必填</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import OtherSettingApi from '../api';
export default {
  components: {

  },
  props: {
    mockData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      repair_phone: true,
      repair_user: true,
      repair_dept: true,
      repair_place: true,
    };
  },
  computed: {
  },
  watch: {
    mockData: {
      handler(newValue, oldValue) {
        const { repair_phone, repair_user, repair_dept, repair_place, } = newValue;
        this.repair_phone = repair_phone.enable;
        this.repair_user = repair_user.enable;
        this.repair_dept = repair_dept.enable;
        this.repair_place = repair_place.enable;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {

  },
  methods: {
    changeRadio(v, key) {
      console.log(v, key);
      this.saveOrUpdateItem(v, key);
    },
    saveOrUpdateItem(checked, key) {
      // const parentType = key.split('_')[0];
      const params = {
        enable: checked,
        parentType: 'mandatory',
        type: key,
        typeValue: [0], // 暂时传0
      };
      OtherSettingApi.saveOrUpdateItem(params,).then(res => {
        this.$message({
          type: 'success',
          message: res,
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '出错了',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mandatory-box{
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  .title{
    font-size: 18px;
    margin-right: 10px;
  }
}

</style>
