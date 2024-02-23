<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 14:16:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 14:44:15
 * @Description:
-->
<template>
  <el-row>
    <el-col :span="24">
      <el-popover placement="bottom-start" width="200" trigger="click">
        <draggable
          tag="el-col"
          :list="fields"
          :component-data="getComponentData()"
          @update="handleUpdate()"
        >
          <el-row
            v-for="(element, idx) in fields"
            :key="element.id"
            style="padding-top: 10px"
          >
            <el-col
              :span="3"
            >
              <div class="grid-content bg-purple-dark">
                {{ idx + 1 }}
              </div>
            </el-col>
            <el-col :span="4"><i class="icon-iconfontsortall" /></el-col>

            <el-col
              :span="6"
            ><el-checkbox v-model="element.checked" @change="handleUpdate">
              {{ element.name }}</el-checkbox>
            </el-col>
          </el-row>
        </draggable>

        <i slot="reference" class="el-icon-s-tools" style="color: #879bba" />
      </el-popover>
    </el-col>
  </el-row>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  components: {
    draggable,
  },
  props: {
    fields: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      activeNames: 'test',
    };
  },
  methods: {
    handleUpdate() {
      const fields = this.fields.filter((i) => i.checked);
      const data = fields.map((i) => i.name);
      this.$emit('changed', data, this.fields);
    },
    handleChange() {
    },
    inputChanged() {},
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged,
        },
        attrs: {
          wrap: true,
        },
        props: {
          value: this.activeNames,
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.el-checkbox ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #2d405e;
}
.icon-iconfontsortall {
  color: #dcdfe6;
}
.bg-purple-dark {
  color: #879bba;
}
</style>
