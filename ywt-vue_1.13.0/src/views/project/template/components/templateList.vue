<!--
    模板列表组件
-->

<template>
  <el-container class="templateList-container">
    <el-header height="42px" class="templateList-header">
      <span class="templateList-header-span"> 模板名称 </span>
      <pure-button label="添加模板" @click="add" />
    </el-header>
    <el-main class="templateList-main">
      <el-collapse-transition>
        <div v-show="showExpand">
          <el-form class="templateList-main-form" size="mini">
            <el-form-item>
              <el-input
                v-model="searchWhere.query"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                size="mini"
              />
            </el-form-item>
            <el-form-item>
              <CascaderDepartment
                v-model="searchWhere.deptId"
                :show-all-levels="false"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchWhere.teamId"
                placeholder="选择运维小组"
                size="mini"
                style="width: 100%"
                :filterable="true"
              >
                <el-option
                  v-for="v in teamList"
                  :key="v.id"
                  :label="v.name"
                  :value="v.id"
                />
              </el-select>
            </el-form-item>
            <el-row class="form-item-footer">
              <el-col :span="12">
                <span class="clear_span" @click="clear"> 清空搜索项 </span>
              </el-col>
              <el-col :span="12" class="T-R">
                <pure-button type="ghost" label="搜索" @click="search" />
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>

      <el-divider>
        <el-button type="text" @click="showExpand = !showExpand">
          {{ expandText }}
          <i
            class="el-icon--right"
            :class="`el-icon-arrow-${showExpand ? 'up' : 'down'} `"
          />
        </el-button>
      </el-divider>
      <ul v-if="result.length" class="templateList-content">
        <li
          v-for="(v, i) in result"
          :key="v.id"
          class="templateList-content-li"
          @click="clickTemplate(v, i)"
          @mouseenter="mouseEnter(v, i)"
          @mouseleave="mouseLeave(v, i)"
        >
          <span class="name" :class="i == index ? 'active' : ''">
            {{ v.name }}
          </span>
          <span v-show="activeEnter == i" class="icon">
            <i class="el-icon-delete" @click.stop="del" />
          </span>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>
import ProjectAPI from '@/apis/project';
import { mixins_base, } from '@/minxins/project';
import _ from 'lodash';
import Edit from './edit.vue';
export default {
  name: 'TemplalteList',
  mixins: [mixins_base],
  data() {
    return {
      index: 0,
      template: {
        id: 0,
        name: '',
      },
      searchWhere: {
        query: '',
        deptId: null,
        teamId: '',
      },
      result: [],
      showExpand: false,
      activeEnter: -1,
    };
  },
  computed: {
    teamList() {
      return this.$store.state['team/center'].list;
    },
    expandText() {
      return this.showExpand ? '收缩查询页' : '展开查询页';
    },
  },
  activated() {
    this.init();
  },
  mounted() {
    this.init();
    this.SET_INJECT_EVENT({
      name: 'templateUpdate',
      fun: this.editCallBack,
      immediate: false,
    });
  },
  methods: {
    clickTemplate(v, i) {
      this.index = i;
      this.template.name = v.name;
      this.template.id = v.id;
      this.$emit('info', Object.assign(v, { index: i, }));
    },

    add() {
      this.$dialog({
        title: '添加',
        position: 'center',
        width: '532px',
        component: () => <Edit />,
      });
    },

    clear() {
      this.searchWhere = this.$options.data().searchWhere;
      this.init();
    },
    search: _.debounce(function () {
      this.init();
    }, 300),
    async init() {
      this.index = 0;
      const rs = await ProjectAPI.template.templateList(this.searchWhere);
      this.result = rs;
      this.$emit('info', this.result);
    },
    async editCallBack() {
      const rs = await ProjectAPI.template.templateList(this.searchWhere);
      this.result = rs;
      const val = this.result[this.index];
      this.$emit('info', val);
    },

    del() {
      if (!this.template.id) {
        return this.$message.warning('请选择要删除的模板!');
      }
      this.$confirm(`是否删除${this.template.name}模板`, {
        type: 'warning',
      }).then(async () => {
        await ProjectAPI.template.deleteTemplate(this.template.id);
        this.$message.success('删除成功!');
        this.template = {};
        this.init();
      });
    },
    mouseEnter(v, i) {
      this.template.id = v.id;
      this.template.name = v.name;
      this.activeEnter = i;
    },
    mouseLeave(v, i) {
      this.activeEnter = -1;
    },
  },
};
</script>

<style  lang="scss" scoped>
.T-R {
  text-align: right;
}
.templateList {
  &-main {
    padding: 0 12px;
    &-form {
    // height: 208px;
      padding-top: 16px;
      > .form-item-footer {
        background: #fff;
        display: flex;
        justify-content: space-between;
        .clear_span {
          font-size: 18px;
          font-weight: 400;
          color: #7d8db3;
          cursor: pointer;
        }
      }
    }
  }
  &-header {
    background: #e2e3e7;
    display: flex;
    padding: 0 12px;

    align-items: center;
    justify-content: space-between;
    &-span {
      font-size: 18px;
      font-weight: 400;
      color: #334266;
    }
  }
  &-content {
    &-li {
      height: 42px;
      padding: 0 0 0 6px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      &:hover {
        background: #e1e8f8;

        cursor: pointer;
      }
      > .name {
        font-size: 18px;
        font-weight: 400;
        color: #334266;
        display: inline-block;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      > .icon {
        font-size: 13px;
        color: #7d8db3;
        flex: 1;
        text-align: center;
      }
      > .active {
        color: #456add;
      }
    }
  }
}
</style>
