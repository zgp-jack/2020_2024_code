/**
* @file userSelect.vue
* @author huang
* @date 2023/11/10
* @description  人员选择面板
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      人员选择
    </template>
    <el-tabs
      tab-position="left"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="item in data"
        :key="item.teamId"
        :label="item.teamName"
      >
        <el-radio-group
          v-if="!multiple"
          v-model="radioValue"
          class="radio-group"
        >
          <el-radio
            :disabled="!isCheckTeam"
            :label="'team'+item.teamId"
            class="radio"
          >
            {{ item.teamName }}
          </el-radio>
          <el-radio
            v-for="subItem in item.voList "
            :key="subItem.userId"
            :label="subItem.userId"
            class="radio"
          >
            {{ subItem.userName }}
          </el-radio>
        </el-radio-group>

        <template v-if="multiple">

          <el-checkbox
            :key="'team'+item.teamId"
            v-model="checkAll"
            :disabled="!isCheckTeam"
            :indeterminate="isIndeterminate"
            :label="'team'+item.teamId"
            class="checkbox"
            @change="handleCheckAllChange($event,item.teamId)"
          >
            {{ item.teamName }}
          </el-checkbox>
          <el-checkbox-group
            v-model="checkValue"
            class="checkbox-group"
            @change="handleCheckedUserChange($event,item.voList)"
          >

            <el-checkbox
              v-for="subItem in item.voList "
              :key="subItem.userId"
              :label="subItem.userId"
              class="checkbox"
            >
              {{ subItem.userName }}
            </el-checkbox>
          </el-checkbox-group>
        </template>

      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
      <pure-button
        label="确定"
        type="major"
        @click="confirm"
      />

    </template>
  </drawer-template>

</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import SytemUserApi from '@/features/system/user/api';
import { find, map, } from 'lodash-es';

export default {
  components: {
    DrawerTemplate,
  },
  props: {
    // 是否可以选择小组  默认:否
    isCheckTeam: Boolean,
    // 是否多选  默认:否
    multiple: Boolean,

  },
  data() {
    return {
      data: [],
      radioValue: '',
      checkValue: [],
      // indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

      isIndeterminate: false,
      checkAll: false,

    };
  },
  computed: {
    teamUserData() {
      return this.data.map(item => {
        return {
          //
        };
      });
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleCheckAllChange(val, teamId) {
      const findChild = find(this.data, { teamId, });
      const childIds = map(findChild.voList, 'userId');
      this.checkValue = val ? childIds : [];
      // this.isIndeterminate = false;
    },
    handleCheckedUserChange(value, children) {
      const count = children.length;
      const checkedCount = value.length;
      this.checkAll = count === checkedCount;
      this.isIndeterminate = checkedCount > 0 && checkedCount < count;
    },
    clickTab() {
      this.handleCheckAllChange(false, null);
      this.handleCheckedUserChange([], []);
      this.checkAll = false;
      this.isIndeterminate = false;
    },

    cancel() {
      this.$emit('done');
    },
    confirm() {
      console.log('cofnig');
      if (this.multiple) {
        this.$emit('done', this.checkValue);
      } else {
        this.$emit('done', this.radioValue);
      }
    },

    async init() {
      const res = await SytemUserApi.getTeamUserList();
      this.data = res;
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.radio {
  & + & {
    margin-top: 16px;
  }

  &-group {
    display: flex;
    flex-direction: column;

  }
}

.checkbox {
  & + & {
    margin-top: 16px;
  }

  &-group {
    display: flex;
    flex-direction: column;

  }
}

</style>
