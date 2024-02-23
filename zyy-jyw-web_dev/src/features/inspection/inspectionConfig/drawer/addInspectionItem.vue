<template>
  <drawer-template>
    <template #title> {{ operation === 'edit' ? '编辑' : '添加' }}巡检项</template>
    <el-form
      ref="form"
      :inline="false"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
    >
      <el-form-item label="巡检资产/单元">
        <el-input
          :value="data.assetsTypeToName || data.directoryToName"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="巡检项名称"
        prop="itemName"
      >
        <el-input v-model="form.itemName" />
      </el-form-item>
      <el-form-item label="巡检项类型">
        <el-radio-group
          v-model="form.itemType"
          @change="itemTypeChange"
        >
          <el-radio
            v-for="item in typesList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.itemType == 1">
        <el-form-item
          key="itemUnit"
          label="巡检项单位"
          prop="itemUnit"
        >
          <DicSelect
            v-model="form.itemUnit"
            dic-key="ins_item_unit"
          />
        </el-form-item>
        <el-form-item
          class="is_required"
          label="阀值范围"
        >
          <el-col :span="11">
            <el-form-item
              class="m-t-0"
              prop="minValue"
            >
              <el-input
                v-model="form.minValue"
                placeholder="最小值"
                style="width: 100%"
                @input="changeMin"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            class="align-center"
          >至
          </el-col>
          <el-col :span="11">
            <el-form-item
              class="m-t-0"
              prop="maxValue"
            >
              <el-input
                v-model="form.maxValue"
                placeholder="最大值"
                style="width: 100%"
                @input="changeMax"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          key="inputDefaultValue"
          :rules="inputDefaultValueRules"
          label="默认值"
          prop="defaultValue"
        >
          <el-input v-model="form.defaultValue" />
        </el-form-item>
      </template>
      <!-- 选项型 -->
      <template v-else>
        <el-form-item
          v-for="(item, index) in form.optionContent"
          :key="index"
          :label="`选项内容${index + 1}`"
          :prop="`optionContent[${index}]`"
          :rules="[{ required: true, message: '请输入选项内容' }]"
        >
          <el-col :span="23">
            <el-input
              :value="item"
              @input="updateOptionContent($event, index)"
            />
          </el-col>
          <el-col
            :span="1"
            class="align-center"
          >
            <i
              v-if="index > 0"
              class="el-icon-delete icon"
              @click="delOptionContentItem(index)"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <pure-button
            icon="add"
            label="添加选项内容"
            type="minor"
            @click="onAddOptionContent"
          />
        </el-form-item>
        <el-form-item
          key="selectDefaultValue"
          :rules="defaultOptionRules"
          label="默认值"
          prop="defaultOption"
        >
          <el-select
            v-model="form.defaultOption"
            :disabled="!optionContentList.length"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in optionContentList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="异常值"
          prop="errorOption"
        >
          <el-select
            v-model="form.errorOption"
            :disabled="!optionContentList.length"
            clearable
            filterable
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in optionContentList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>

        </el-form-item>

      </template>

      <el-form-item
        label="是否启用"
        prop="isEnable"
      >
        <el-switch
          v-model="form.isEnable"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <pure-button
        label="保存"
        @click="onSubmit('save')"
      />
      <pure-button
        v-if="operation === 'add'"
        label="保存并继续创建"
        type="major"
        @click="onSubmit('saveToCreate')"
      />
      <el-button @click="onCancel">取消</el-button>
    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import InspectionApi from '../../api';
import { INSPECTION_CONFIG_ITEM_TYPE, } from '../../inspection.config';

const reg = /^(\-|\+)?\d+(\.\d+)?$/;
export default {
  components: {
    DrawerTemplate,
    DicSelect,
  },
  props: {
    // add edit
    operation: {
      type: String,
      default: 'add',
    },
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      rules: {
        itemName: [
          {
            required: true,
            message: '请输入巡检项名称',
          },
        ],
        itemUnit: [
          {
            required: true,
            message: '请选择巡检项单位',
          },
        ],
        minValue: [
          {
            required: true,
            message: '请输入最小值',
          },
          {
            validator: (rule, value, callback) => {
              if (reg.test(value)) {
                if (Number(value) >= Number(this.form.maxValue)) {
                  callback(new Error('最小值不能大于或者等于最大值'));
                } else {
                  callback();
                }
              } else {
                callback(new Error('请输入数字或者小数'));
              }
            },
          },
        ],
        maxValue: [
          {
            required: true,
            message: '请输入最大值',
          },
          {
            validator: (rule, value, callback) => {
              if (reg.test(value)) {
                if (Number(value) <= Number(this.form.minValue)) {
                  callback(new Error('最大值不能小于或者等于最小值'));
                } else {
                  callback();
                }
              } else {
                callback(new Error('请输入数字或者小数'));
              }
            },
          },
        ],
        errorOption: [
          {
            trigger: 'change',
            required: true,
            validator: (rule, value, callback) => {
              if (value.length) {
                callback();
              } else {
                callback('请选择异常值');
              }
            },
          },
        ],
      },
      // 巡检项类型
      typesList: INSPECTION_CONFIG_ITEM_TYPE,

      form: {
        //  * 默认值项
        defaultOption: '',
        // 默认值数值
        defaultValue: '',
        // 异常值选项
        errorOption: [],
        // 是否启用（1是 0否）
        isEnable: 1,
        // 巡检项名称
        itemName: '',
        // 巡检项类型（1数值型 2选项型）
        itemType: 1,
        // 巡检项单位（数据字典）
        itemUnit: '',
        // 阈值最大值
        maxValue: '',
        // 阈值最小值
        minValue: '',
        // 选项内容（多条用逗号隔开）
        optionContent: [],
        // 配置主表ID（资产 单元）
        parentId: '',
        // 配置类型（1资产类型 2巡检单元）
        parentType: '',
      },
    };
  },
  computed: {
    defaultOptionRules() {
      return [{
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (!value) {
            callback('请选择默认值');
          } else {
            callback();
          }
        },
      },
      ];
    },
    inputDefaultValueRules() {
      return [{
        required: true,
        validator: (rule, value, callback) => {
          if (value) {
            if (reg.test(value)) {
              callback();
            } else {
              callback(new Error('请输入数字或者小数'));
            }
          } else {
            callback('请输入默认值');
          }
        },
      },
      ];
    },
    optionContentList() {
      return this.form.optionContent.filter((item) => {
        return item.trim() !== '';
      });
    },
  },
  created() {
  },
  mounted() {
    if (this.operation === 'edit') {
      this.form = {
        ...this.data,
      };
      this.form.optionContent = this.data.optionContent || [];
    } else {
      this.form.parentId = this.data.parentId;
      this.form.parentType = this.data.parentType;
    }
  },
  methods: {

    validateForm() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.$message.success('验证通过');
        } else {
          this.$message.error('验证失败');
        }
      });
    },
    changeMax(val) {
      if (Number(val) >= Number(this.form.minValue)) {
        this.$refs.form.clearValidate('minValue');
      }
    },
    changeMin() {
      if (Number(this.form.maxValue) <= Number(this.form.minValue)) {
        this.$refs.form.clearValidate('maxValue');
      }
    },
    //  删除选项内容
    delOptionContentItem(index) {
      this.form.optionContent.splice(index, 1);
    },
    //  添加选项内容
    updateOptionContent(val, index) {
      this.$set(this.form.optionContent, index, val);
    },
    onAddOptionContent() {
      this.form.optionContent.push('');
    },
    // 巡检项类型
    itemTypeChange() {
      this.form.defaultValue = '';
      this.form.errorOption = [];
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    onSubmit(tag) {
      try {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              await InspectionApi.addInspectionConfig(this.form);
              this.$message.success('添加成功');
              if (tag === 'save') {
                this.$emit('done');
              } else {
                this.$refs.form.resetFields();
                this.form.optionContent = [];
              }
            } catch (err) {
              this.$notify({
                type: 'error',
                message: err,
              });
            }
          }
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err,
        });
      }
    },
    onCancel() {
      this.$emit('done');
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.m-t-0 {
  margin-bottom: 0;
}

.icon {
  font-size: 16px;

  &:hover {
    color: #ff836b;
  }
}

.is_required {
  ::v-deep {
    .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
</style>
