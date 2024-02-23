<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 11:07:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 10:26:34
 * @Description:厂家
-->
<template>
  <div>
    <div v-for="(item,index) in list" :key="index">
      <el-form-item
        :label="manufacturerLabel+(multi?(index+1):'')"
        :prop="'manufacturerInfos.'+index+'.manufacturerId'"
        :rules="{ required: true, message: '请选择'+manufacturerLabel, trigger: 'blur' }"
      >
        <el-select v-model="item.manufacturerId" class="w-100" @change="(val)=>onManufacturerChange(val,index)">
          <el-option v-for="(option,index1) in manufacturerList" :key="index1" :label="option.deptName" :value="option.id" />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="manufacturerUserLabel">
            <el-select v-model="list[index].manufacturerUser" :disabled="!manufacturerUserList[index].length" class="w-100" @change="(val)=>onManufacturerUserChange(val,0)">
              <el-option v-for="(engineerItem,engineerIndex) in manufacturerUserList[index]" :key="engineerIndex" :label="engineerItem.name" :value="engineerItem.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="manufacturerPhoneLabel">
            <el-input v-model="list[index].manufacturerPhone" :disabled="!manufacturerUserList[index].length" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-form-item v-if="multi">
      <el-button
        @click="onAddManufacturer()"
      >添加厂家</el-button>
    </el-form-item>
  </div>
</template>

<script>
import EngineerApi from '@/feat/system/user/api';
import {
  find,
} from 'lodash';
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    multi: {
      type: Boolean,
      default: false,
    },
    manufacturerLabel: {
      type: String,
      default: '厂家名称',
    },
    manufacturerUserLabel: {
      type: String,
      default: '厂家代表',
    },
    manufacturerPhoneLabel: {
      type: String,
      default: '联系电话',
    },
  },
  data() {
    return {
      // 厂家列表
      manufacturerList: this.$store.state.ticketCarryInService.manufacturerList,
      // 厂家代表列表
      manufacturerUserList: [[], []],
    };
  },
  created() {
    this.initManufacturerInfo();
  },
  methods: {
    async initManufacturerInfo() {
      for (let i = 0; i < this.list.length; ++i) {
        this.$set(this.manufacturerUserList, i, []);
      }
      for (let i = 0; i < this.list.length; ++i) {
        const manufacturer = this.list[i];
        if (manufacturer.manufacturerId) {
          const { list, } = await await EngineerApi.list({ pageNum: 0, pageSize: 9999, deptId: manufacturer.manufacturerId, });
          this.$set(this.manufacturerUserList, i, list);
        }
      }
    },
    // 维修厂家变更
    async onManufacturerChange(val, index) {
      this.$set(this.manufacturerUserList, index, []);
      this.$set(this.list[index], 'manufacturerUser', null);
      this.$set(this.list[index], 'manufacturerPhone', null);
      const { list, } = await EngineerApi.list({ pageNum: 0, pageSize: 9999, deptId: val, });
      this.$set(this.manufacturerUserList, index, list);
      const headUser = list[0];
      if (headUser) {
        this.$set(this.list[index], 'manufacturerUser', headUser.id);
        this.$set(this.list[index], 'manufacturerPhone', headUser.mblNo);
      }
    },
    onManufacturerUserChange(val, index) {
      const user = find(this.manufacturerUserList[index], { id: val, });
      this.$set(this.list[index], 'manufacturerPhone', user.mblNo);
    },
    onAddManufacturer() {
      this.list.push({ manufacturerId: null, manufacturerUser: null, manufacturerPhone: null, });
      this.manufacturerUserList.push([]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
