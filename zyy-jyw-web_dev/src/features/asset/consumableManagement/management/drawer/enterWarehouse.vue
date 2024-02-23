/**
* @file enterWarehouse.vue
* @author huang
* @date 2023/11/8
* @description 入库
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      入库
    </template>
    <el-form
      key="form"
      ref="form"
      :model="form"
    >
      <el-form-item
        label="备注"
        label-width="120px"
      >
        <el-input
          v-model="form.remark"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        label="附件"
        label-width="120px"
      >
        <pure-upload v-model="form.enclosure" />
      </el-form-item>
      <pure-button
        label="添加条目"
        type="major"
        @click="addEntry"
      />
      <div class="table-area">

        <el-table
          key="table"
          :data="form.reverseList"
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
                :prop="'reverseList.'+$index+'.id'"
                :rules="[
                  {
                    required:true,
                    message:'请选择耗材'
                  }
                ]"
              >
                <el-select
                  v-model="row.id"
                  @change="changeConsumable($event,$index)"
                >
                  <el-option
                    v-for="item in consumableList"
                    :key="item.id"
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
            label="实际库存"
            prop="realReserve"
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
            label="入库数量"
            width="200px"
          >
            <template #default="{row,$index}">
              <el-form-item
                :prop="'reverseList.'+$index+'.quantity'"
                :rules="[
                  {
                    required:true,
                    message:'请输入入库数量',
                  }
                ]"
              >
                <el-input-number
                  v-model="row.quantity"
                  :disabled="!row.id"
                  :max="999"
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
import ConsumableApi from '../api';
import { map, } from 'lodash-es';

export default {
  name: 'EnterWarehouse',
  components: {
    PureButton,
    DrawerTemplate,
  },
  data() {
    return {
      consumableList: [],
      form: {
        // 附件
        enclosure: [],
        // 备注
        remark: '',
        // 耗材列表 [{id,quantity}]
        reverseList: [],
      },
    };
  },
  mounted() {
    this.getConsumableList();
  },
  methods: {
    // 添加条目
    addEntry() {
      this.form.reverseList.push({
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
      const res = await ConsumableApi.getList();
      this.consumableList = res?.rows || [];
    },
    //   选择耗材
    changeConsumable(val, index) {
      const item = this.consumableList.find(item => item.id === val);
      this.form.reverseList[index] = item;
    },
    //    删除
    del(index) {
      this.form.reverseList.splice(index, 1);
    },
    // 撤销
    cancel() {
      this.$emit('done');
    },

    //   提交
    async submit() {
      if (this.form.reverseList.length === 0) {
        this.$notify.warning('请添加条目');
        return;
      }
      try {
        const valid = await this.$refs.form.validate();
        if (valid) {
          const data = {
            ...this.form,
          };
          data.reverseList = map(data.reverseList, (item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            };
          });
          await ConsumableApi.enterConsumable(data);
          this.$notify.success('入库成功!');
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
