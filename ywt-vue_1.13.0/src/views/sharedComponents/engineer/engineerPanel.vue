<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-16 14:00:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-20 17:35:23
 * @Description:
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">选择工程师</span>
    </div>
    <div class="body">
      <div class="search">
        <search v-model="filterText" />
      </div>
      <div class="letter">
        <el-tag effect="plain" @click="handleFilter()">全部</el-tag>
        <el-tag
          v-for="(item,index) in firstLetters"
          :key="index"
          effect="plain"
          @click="handleFilter(item)"
        >
          {{ item }}
        </el-tag>
      </div>
      <div class="engineer"><el-tree
        ref="tree"
        :data="filteredEngineer"
        node-key="id"
        :props="{label: 'name'}"
        check-strictly
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
      >
        <span slot-scope="{ data }">
          <el-radio
            v-model="radio"
            :label="data.id"
            :disabled="data.disabled"
            @change="change(data)"
          >
            {{ data.name }}
            <span v-if="data.orderAmount">(<span style="color:red">{{ data.orderAmount }}</span>)</span>
            <span v-if="data.workState"> (<span :style="{color:data.workColor}">{{ data.workState }}</span>)</span>
          </el-radio>
        </span>
      </el-tree>
      </div>
    </div>
    <div class="button">
      <el-button
        size="mini"
        type="primary"
        @click="confirm"
      >确认选择</el-button>
    </div>
  </div>

</template>

<script>
import Pinyin from 'pinyin';
import EngineerApi from '@/apis/system/engineer';
export default {
  components: {
    Search: () => import('@/components/input/search.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      allEngineer: [],
      groupEngineer: [],
      selectedData: null,
      firstLetters: [],
      selectedFirstLetter: null,
      checkedList: [],
      radio: '',
      filterText: '',
    };
  },
  computed: {
    filteredEngineer() {
      if (!this.selectedFirstLetter) {
        return this.groupEngineer;
      } else {
        return this.filterEngineer(this.groupEngineer, this.selectedFirstLetter);
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }, },
  async created() {
    try {
      const list = await EngineerApi.groupedList();
      const firstLetter = [];
      this.allEngineer = list.map(item => {
        const letter = this.getFirstLetter(item.userName);
        firstLetter.push(letter);
        return {
          id: `user-${item.teamId}-${item.userId}`,
          name: item.userName,
          letter,
          teamId: item.teamId,
          teamName: item.teamName,
          orderAmount: item.orderAmount,
          workState: item.workState,
          workColor: item.workColor,
        };
      });
      this.firstLetters = [...new Set(firstLetter)];
      this.firstLetters = this.firstLetters.sort();
      this.getGroup();
      if (this.data?.id) {
        this.radio = this.data.id;
        this.change(this.data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    change(data) {
      this.checkedList = [];
      this.checkedList[0] = data;
    },
    confirm() {
      const data = this.checkedList[0];
      if (data) {
        this.$emit('done', data);
      } else {
        this.$message({
          type: 'error',
          message: '请选择工程师',
        });
      }
    },
    // 筛选数据
    handleFilter(firstLetter) {
      this.selectedFirstLetter = firstLetter;
    },
    filterEngineer(all, firstLetter) {
      const res = [];
      all.forEach(item => {
        const tmp = { ...item, };
        if (tmp.isTeam) {
          tmp.children = this.filterEngineer(tmp.children, firstLetter);
          res.push(tmp);
        }
        if (tmp.letter === firstLetter) {
          res.push(tmp);
        }
      });
      return res;
    },
    handleCheckChange(data, checked, node) {
      if (checked === true) {
        this.checkedId = data.id;
        this.$refs.tree.setCheckedKeys([data.id]);
        this.selectedData = data;
      } else {
        if (this.checkedId === data.id) {
          this.$refs.tree.setCheckedKeys([data.id]);
        }
      }
    },
    // 生成分组
    getGroup() {
      const groupMap = new Map();
      this.allEngineer.forEach(item => {
        if (groupMap.has(item.teamId)) {
          const group = groupMap.get(item.teamId);
          group.children.push(item);
          groupMap.set(item.teamId, group);
        } else {
          let groupData = {};
          if (!item.teamId) {
            groupData = { id: `team-${item.teamId}`, name: '未分组', disabled: true, isTeam: true, children: [item], };
          } else {
            groupData = { id: `team-${item.teamId}`, name: item.teamName, isTeam: true, children: [item], };
          }
          groupMap.set(item.teamId, groupData);
        }
      });
      this.groupEngineer = [...groupMap.values()];
    },
    getFirstLetter(word) {
      return Pinyin(word, { style: Pinyin.STYLE_NORMAL, heteronym: true, })[0][0].substring(0, 1).toUpperCase();
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    flex-direction: column;
    height: 100%;
    .search {
        // height: 30px;
        width: 50%;
        padding-bottom: 16px;
    }
    .letter {
        // height: 60px;
        padding-bottom: 16px;
        ::v-deep .el-tag {
            margin-right: 5px;
            margin-bottom: 5px;
            cursor: pointer;
        }
    }
    .engineer {
        flex: 1;
        overflow: scroll;
         &::-webkit-scrollbar{
                width:6px;
                height:50%;
            }
            &::-webkit-scrollbar-thumb{
                background-color: #DEE2EE;
                border-radius: 3px;
            }
    }
}
  .button {
   height: 64px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
</style>
