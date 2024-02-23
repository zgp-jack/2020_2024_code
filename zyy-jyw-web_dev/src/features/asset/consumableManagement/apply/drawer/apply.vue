/**
* @file register.vue
* @author huang
* @date 2023/11/8
* @description  耗材申领
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      耗材申领
    </template>
    <el-form
      key="form"
      ref="form"
      :model="form"
    >
      <el-form-item
        :rules="[
          {
            required: true,
            message: '请选择申领科室'
          }
        ]"
        label="申领科室"
        label-width="120px"
        prop="inDept"
      >
        <dept-cascader v-model="form.inDept" />
      </el-form-item>
      <el-form-item
        label="备注"
        label-width="120px"
      >
        <el-input
          v-model="form.remark"
          type="textarea"
        />
      </el-form-item>

      <pure-button
        label="添加条目"
        type="major"
        @click="addEntry"
      />
      <div class="table-area">

        <el-table
          key="table"
          :data="form.reserveList"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80px"
          />
          <el-table-column
            label="耗材名称"
            width="140px"
          >
            <template #default="{row,$index}">
              <el-form-item
                :prop="'reserveList.'+$index+'.id'"
                :rules="[
                  {
                    required:true,
                    message:'请选择耗材'
                  }
                ]"
              >
                <el-select
                  v-model="row.id"
                  clearable
                  @change="changeConsumable($event,$index)"
                  @clear="clearConsumable($index)"
                >
                  <el-option
                    v-for="item in consumableList"
                    :key="item.id"
                    :disabled="consumableIds.includes(item.id)"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

            </template>
          </el-table-column>
          <el-table-column
            label="规格型号"
            prop="model"
            width="100px"
          >
            <!--        -->
          </el-table-column>
          <el-table-column
            label="供应商"
            prop="supplierName"
            width="100px"
          >
            <!--        -->
          </el-table-column>

          <el-table-column
            label="可用库存"
            prop="usefulReserve"
            width="100px"
          >
            <!--        -->
          </el-table-column>
          <el-table-column
            label="数量"
            width="200px"
          >
            <template #default="{row,$index}">
              <el-form-item
                :prop="'reserveList.'+$index+'.quantity'"
                :rules="[
                  {
                    required:true,
                    message:'请输入数量'
                  }
                ]"
              >

                <el-input-number
                  v-model="row.quantity"
                  :disabled="!row.id"
                  :max="Number(row.usefulReserve)"
                  :min="1"
                  :precision="0"
                  controls-position="right"
                />

                {{ row.unitToName }}
              </el-form-item>

            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100px"
          >
            <template #default="{$index}">
              <pure-button
                label="删除"
                type="text"
                @click="del($index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <template #footer>
      <pure-button
        label="确定"
        type="major"
        @click="submit"
      />
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />

    </template>
  </drawer-template>
</template>
<script>
import DrawerTemplate from '@//common/components/drawer/template.vue';
import PureButton from '@/common/components/button/index.vue';
import ConsumableApi from '@/features/asset/consumableManagement/management/api';
import ApplyApi from '../api';
import { map, filter, } from 'lodash-es';
import DeptCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import { mapState, } from 'vuex';

export default {
  name: 'EnterWarehouse',
  components: {
    PureButton,
    DrawerTemplate,
    DeptCascader,
  },
  data() {
    return {
      ruleNum: [
        {
          validator: (rule, value, callback) => {
            if (Number(value) <= 0) {
              callback('请输入数量');
            } else {
              callback();
            }
          },
        },
      ],
      consumableList: [],
      form: {
        // 申请科室
        inDept: null,
        // 备注
        remark: '',
        // 耗材列表 [{id,quantity}]
        reserveList: [],
      },
    };
  },
  computed: {
    ...mapState('APP_LOGIN', [
      'userInfo',
    ]),
    consumableIds() {
      const val = filter(this.form.reserveList, 'id');
      return map(val, 'id');
    },
  },
  mounted() {
    this.form.inDept = this.userInfo.dept.deptId;
    this.getConsumableList();
  },
  methods: {
    // 添加条目
    addEntry() {
      this.form.reserveList.push({
        name: '',
        model: '',
        supplierName: '',
        realReserve: '',
        usefulReserve: '',
        quantity: '',
        id: '',
      });
    },
    //   获取耗材列表
    async getConsumableList() {
      const res = await ConsumableApi.getList({ reserveState: 1, });

      this.consumableList = res?.rows || [];
    },
    clearConsumable(index) {
      this.$set(this.form.reserveList, index, {
        name: '',
        model: '',
        supplierName: '',
        realReserve: '',
        usefulReserve: '',
        quantity: '',
        id: null,
      });
    },
    //   选择耗材
    changeConsumable(val, index) {
      if (val) {
        const item = this.consumableList.find(item => item.id === val);
        this.$set(this.form.reserveList, index, { ...item, });
        this.$set(this.form.reserveList[index], 'quantity', 1);
      }
    },
    //    删除
    del(index) {
      this.form.reserveList.splice(index, 1);
    },
    //   取消
    cancel() {
      this.$emit('done');
    },
    //   提交
    async submit() {
      if (this.form.reserveList.length === 0) {
        this.$notify.warning('请添加条目');
        return;
      }
      if (this.form.reserveList.some(item => !item.id)) {
        this.$notify.warning('请选择耗材');
        return;
      }
      const valid = await this.$refs.form.validate();
      try {
        if (valid) {
          const data = {
            ...this.form,
          };
          data.reserveList = map(data.reserveList, (item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            };
          });
          await ApplyApi.apply(data);
          this.$notify.success('申领成功!');
          this.$emit('done');
        }
      } catch (err) {
        this.$notify.error(err);
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table-area {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}

</style>
