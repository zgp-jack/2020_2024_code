<template>
  <el-popover
    style="padding:0"
    popper-class="no-padding"
    placement="bottom-start"
    width="800"
    :offset="-16"
    :visible-arrow="false"
    trigger="click"
    @show="init"
  >
    <i slot="reference" class="el-icon-s-operation" />
    <el-row class="row-wrapper" type="flex">
      <el-col :span="7" class=" col-left">
        <span class="title">
          固定表头(左)
        </span>
        <draggable
          v-model="fixedLeftList"
          tag="ul"
          class="draggable-group"
          :group="{
            name: 'left',
            name: 'right',
            name: 'activtify',
          }"
          handle=".handle"
        >
          <li
            v-for="element in fixedLeftList"
            :key="element.id"
            class="draggable-group-item"
          >
            <el-row type="flex" align="middle" justify="space-around">
              <el-col :span="4">
                <i class="handle icon-drag1  draggable-group-item-drag" />
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="element.show"
                  class="draggable-group-item-checkbox"
                />
              </el-col>
              <el-col :span="16">
                <span class="draggable-group-item-label"> {{ element.label }}</span>
              </el-col>
            </el-row>
          </li>
        </draggable>
      </el-col>
      <el-col :span="10" class="col-center">
        <span class="title">
          活动表头
        </span>
        <draggable
          v-model="activityList"
          tag="ul"
          :group="{
            name: 'left',
            name: 'right',
            name: 'activtify',
          }"
          class="draggable-group"
        >
          <li
            v-for="(element, index) in activityList"
            :key="element.id"
            class="draggable-group-item"
          >
            <el-row type="flex" align="middle" justify="space-around">
              <el-col :span="4" class="draggable-group-item-index">
                <span>{{ index + 1 }}</span>
              </el-col>
              <el-col :span="4">
                <i class="icon-drag1  draggable-group-item-drag" />
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="element.show"
                  class="draggable-group-item-checkbox"
                />
              </el-col>
              <el-col :span="12">
                <span class="draggable-group-item-label"> {{ element.label }}</span>
              </el-col>
            </el-row>

          </li>
        </draggable>
      </el-col>
      <el-col :span="7" class=" col-right">
        <span class="title">
          固定表头(右)
        </span>
        <draggable
          v-model="fixedRightList"
          :group="{
            name: 'left',
            name: 'right',
            name: 'activtify',
          }"

          tag="ul"
          class="draggable-group"
        >
          <li
            v-for="element in fixedRightList"
            :key="element.id"
            class="draggable-group-item"
          >
            <el-row type="flex" align="middle" justify="space-around">
              <el-col :span="4">
                <i class="handle icon-drag1  draggable-group-item-drag" />
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="element.show"
                  class="draggable-group-item-checkbox"
                />
              </el-col>
              <el-col :span="16">
                <span class="draggable-group-item-label"> {{ element.label }}</span>
              </el-col>
            </el-row>
          </li>
        </draggable>
      </el-col>
    </el-row>

  </el-popover>
</template>

<script>
import draggable from 'vuedraggable';
import _ from 'lodash';
export default {
  name: 'TableHeader',
  components: {
    draggable,
  },
  props: {
    columnList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      controlOnStart: true,
      fixedLeftList: [],
      fixedRightList: [],
      activityList: [],

    };
  },
  computed: {
    FormatterColumnList() {
      return _.map(this.columnList, (column, index) => {
        return {
          ...column,
          id: index,
        };
      });
    },
    PackageColumnList: {
      get() {
        const left = _.map(this.fixedLeftList, (item) => {
          return {
            ...item,
            fixed: true,
          };
        });
        const active = _.map(this.activityList, (item) => {
          return {
            ...item,
            fixed: false,
          };
        });
        const right = _.map(this.fixedRightList, (item) => {
          return {
            ...item,
            fixed: 'right',
          };
        });
        return [...left, ...active, ...right];
      },
    },
  },
  watch: {
    PackageColumnList: {
      handler: _.debounce(function (newVal, oldVal) {
        this.$emit('change', newVal);
      }, 1000),
      deep: true,
    },
  },
  methods: {
    init() {
      const copyVal = _.cloneDeep(this.FormatterColumnList);
      this.fixedLeftList = _.filter(copyVal, { fixed: true, });
      this.fixedRightList = _.filter(copyVal, { fixed: 'right', });
      this.activityList = _.filter(copyVal, { fixed: false, });
    },

  },
};
</script>

<style lang="scss" scoped>
.title{
font-size: 18px;
font-weight: 400;
color: #7d8db3;
display: block;
margin: 0 0 0 8px;
}
.row{
  &-wrapper{
    padding: 6px 0;
  }
}
.col{
  &-left,&-center{
    box-shadow:1px 0 0 rgba(230,234,242,1)
  }
}
.draggable {
  &-group {
    list-style: none;
    margin: 0;
    padding: 0;
    &-item {
      // display: flex;
      // align-items: center;
      cursor: move;

      &-index {
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: #7d8db3;
        display: inline-block;
        // width: 22px;
        margin: 0 0 0 8px;

      }
      &-drag {
        font-size: 16px;
        margin: 0 0 0 8px;
      }
      &-checkbox {
        margin: 0 8px;
      }
      &-label {
        font-size: 18px;
        font-weight: 400;
        color: #334266;
        white-space: normal;

      }
    }
  }
}
</style>
