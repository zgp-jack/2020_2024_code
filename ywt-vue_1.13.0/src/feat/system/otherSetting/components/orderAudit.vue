<template>
  <div class="switch-body">
    <div
      class="switch-body-tree fault-box"
      :style="{
        border: faultChecked ? '1px solid #426ED7' : '1px solid #F0F1F5',
      }"
    >
      <div
        class="switch-body-tree-header"
        :style="{ background: faultChecked ? '#426ED7' : '#FAFAFA' }"
      >
        <el-checkbox
          v-model="faultChecked"
          :disabled="!mockData.enable"
          :style="{ color: faultChecked ? '#fff' : '#7D8DB3' }"
          @change="changeModule('fault')"
        >使用故障</el-checkbox>
      </div>
      <div class="fault-box-body">
        <configBox
          class="fault-box-item"
          ref-type="fault_source"
          :fault-checked="faultChecked"
          :checked-data="mockData.fault"
        />
        <configBox
          class="fault-box-item"
          ref-type="fault_classify"
          :fault-checked="faultChecked"
          :checked-data="mockData.fault"
        />
      </div>
    </div>

    <div
      class="switch-body-tree people-box"
      :style="{
        border: peopleChecked ? '1px solid #426ED7' : '1px solid #F0F1F5',
      }"
    >
      <div
        class="switch-body-tree-header"
        :style="{ background: peopleChecked ? '#426ED7' : '#FAFAFA' }"
      >
        <el-checkbox
          v-model="peopleChecked"
          :disabled="!mockData.enable"
          :style="{ color: peopleChecked ? '#fff' : '#7D8DB3' }"
          @change="changeModule('group')"
        >使用人员</el-checkbox>
      </div>
      <engineerTypeSelect
        ref="group"
        ref-type="group_user"
        style="width: 100%"
        :people-checked="peopleChecked"
        :checked-data="mockData.group"
      />
    </div>
  </div>
</template>

<script>
import OtherSettingApi from '../api';
import configBox from './configBox.vue';
import engineerTypeSelect from './engineerTypeSelect.vue';
export default {
  components: {
    configBox,
    engineerTypeSelect,
  },
  props: {
    mockData: {
      type: Object,
      default: () => {},
    },
    configType: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      faultChecked: false,
      peopleChecked: false,
      sourceListRoot: [
        {
          id: 1,
          label: '故障来源',
        }
      ],
    };
  },
  computed: {
  },
  watch: {
    mockData: {
      handler(newValue, oldValue) {
        const { enable, fault, group, } = this.appendDataTree(newValue);
        this.faultChecked = fault.enable;
        this.peopleChecked = group.enable;
        if (!enable) {
          this.faultChecked = false;
          this.peopleChecked = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    appendDataTree(data) {
      const treeKeys = [
        { type: 'Boolean', name: 'enable', },
        { type: 'Object', name: 'fault', },
        { type: 'Object', name: 'group', }
      ];
      if (!data) {
        return {
          enable: false,
          fault: {
            enable: false,
          },
          group: {
            enable: false,
          },
        };
      }
      const res = {};
      treeKeys.forEach(item => {
        if (item.type === 'Boolean') {
          if (!data[item.name]) {
            res[item.name] = false;
          } else {
            res[item.name] = data[item.name];
          }
        }
        if (item.type === 'Object') {
          if (!data[item.name]) {
            res[item.name] = { enable: false, value: [], };
          } else {
            res[item.name] = data[item.name];
          }
        }
      });
      return res;
    },
    useModuleConfig(v, type) {
      const params = {
        parentType: this.configType.type,
        type: type,
      };
      OtherSettingApi.mutexSwitch(params).then(res => {
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
    changeModule(module) {
      if (module === 'fault') {
        this.useModuleConfig(this.faultChecked, module);
        this.peopleChecked = false;
      } else {
        this.useModuleConfig(this.peopleChecked, module);
        this.$refs.group.showDropDown();
        this.faultChecked = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.switch-body {
  display: flex;
  .switch-body-tree {
    min-height: 400px;
    margin: 0 10px;
    border: 1px solid #426ed7;
    border-radius: 5px 5px 0 0;
    .switch-body-tree-header {
      width: 100%;
      height: 33px;
      padding-left: 10px;
      color: #fff;
      background: #426ed7;
      border-radius: 3px 3px 0 0;
      border-radius: 3px 3px 0 0;
      ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        border-color: #fff;
      }
      ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff;
      }
    }
  }
  .fault-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% / 3 * 2);
    .fault-box-body {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .fault-box-item {
        width: 50%;
        .switch-body-tree-header {
          background: #fff;
          padding-left: 10px;
          height: 30px;
          font-size: 16px;
          line-height: 30px;
        }
      }
      .fault-box-item:first-child {
        border-right: 1px solid #e6eaf2;
      }
      .fault-box-item:last-child {
        border-left: 1px solid #e6eaf2;
      }
    }
  }
  .people-box {
    width: calc(100% / 3);
  }
}
</style>
