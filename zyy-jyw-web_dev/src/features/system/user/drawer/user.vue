<template>
  <div class="drawer">
    <div class="header">
      <span class="title">选择人员/小组</span>
    </div>
    <div class="body">
      <div class="search">
        <search v-model="searchValue" placeholder="查找人员/小组" />
      </div>
      <el-row class="content">
        <el-col :span="6" class="nav h-100">

          <span
            v-for="(item,index) in teamEngineer"
            :key="index"
            class="item"
            :class="{activated: activatedItem===index}"
            @click="scrollToAnchor(item,index)"
          >
            {{ item.name }}
          </span>
        </el-col>
        <el-col :span="18" class="h-100">
          <span class="tip">
            <svg-icon icon-class="tip" />
            单选人员或小组
          </span>
          <div class="engineer">
            <el-tree
              ref="tree"

              :data="filteredTeamEngineer"
              node-key="id"
              :props="{label: 'name'}"
              check-strictly
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
            >
              <span :id="data.id" slot-scope="{data}">
                <span v-if="data.isTeam&&teamDisabled" class="pure-team-label">{{ data.name }}</span>
                <el-radio
                  v-else
                  :ref="'radio-'+data.id"
                  v-model="radio"
                  class="radio"
                  :label="data.id"
                  :disabled="data.disabled"
                  @change="handleNodeChange(data)"
                >
                  {{ data.name }}
                  <span v-if="showOrder&&data.orderAmount">(<span style="color:red">{{ data.orderAmount }}</span>)</span>
                  <span v-if="showDuty&&data.workState"> (<span :style="{color:data.workColor}">{{ data.workState }}</span>)</span>
                  <!-- <template v-for="(item,index) in data.whereaboutsList">
                <tag :key="index" :color="item.colorCode" size="mini">{{ item.name }}</tag>
              </template> -->
                </el-radio>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>

    </div>
    <div class="footer">
      <pure-button type="default" label="确认选择" @click="confirm" />
    </div>
  </div>
</template>

<script>
import Pinyin from 'pinyin';
import EngineerApi from '@/features/system/user/api';
export default {
  components: {
    Search: () => import('@/common/components/retrieval'),
  },
  props: {
    // 节点是否显示工单数量
    showOrder: {
      type: Boolean,
      default: true,
    },
    // 节点是否显示值班状态
    showDuty: {
      type: Boolean,
      default: true,
    },
    // 是否禁用选择小组
    teamDisabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 传入的默认选中值
     * example {
     *  name: '小组',
     *  isTeam: true,
     *  teamId：1,
     *  engineerId:2
     * }
     */
    defaultSelectedData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    disabledEngineer: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      // 工程师普通数据
      allEngineer: [],
      // 工程师按小组分组后的数据
      teamEngineer: [],
      // 首字母
      firstLetters: [],
      searchValue: '',
      // 选择的筛选首字母
      selectedFirstLetter: '',
      checkedList: [],
      radio: '',
      tabPosition: '',
      teamList: [],
      activatedItem: 0,
    };
  },
  computed: {
    filteredTeamEngineer() {
      if (!this.selectedFirstLetter) {
        return this.teamEngineer;
      } else {
        return this.filterTeamEngineerByFirstLetter(this.teamEngineer, this.selectedFirstLetter);
      }
    },
  },
  watch: {
    searchValue(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {

  },
  async created() {
    try {
      const a = await EngineerApi.getTeamUserList();
      const list = this.convert(a);
      const firstLetter = [];
      this.allEngineer = list.map(item => {
        const letter = this.getFirstLetter(item.userName);
        firstLetter.push(letter);
        const disabled = this.disabledEngineer.includes(item.userId);
        return {
          id: `engineer-${item.teamId}-${item.userId}`,
          name: item.userName,
          letter,
          teamId: item.teamId,
          engineerId: item.userId,
          teamName: item.teamName,
          orderAmount: item.orderAmount,
          workState: item.workState,
          disabled: disabled,
          workColor: item.workColor,
          whereaboutsList: item.whereaboutsList,
        };
      });
      // 去掉重复的首字母
      this.firstLetters = [
        ...new Set(firstLetter),
      ];
      // 对首字母进行排序
      this.firstLetters = this.firstLetters.sort();
      this.genTeamData();

      // 如传入默认值,进行回显处理
      if (this.defaultSelectedData.teamId || this.defaultSelectedData.engineerId) {
        this.dealWithDefaultSelectedData();
      }
    } catch (error) {
      this.$message({
        type: 'error',
        message: error,
      });
    }
  },
  methods: {
    convert(list) {
      const temp = [];
      for (let i = 0; i < list.length; ++i) {
        const team = list[i] || {};
        const voList = team.voList || [];
        for (let j = 0; j < voList.length; ++j) {
          const a = voList[j];
          const item = {
            orderAmount: a.orderNum,
            teamId: team.teamId,
            teamName: team.teamName,
            userId: a.userId,
            userName: a.userName,
          };
          temp.push(item);
        }
      }
      return temp;
    },
    // 获取名字首字母
    getFirstLetter(word) {
      return Pinyin(word, { style: Pinyin.STYLE_NORMAL, heteronym: true, })[0][0].substring(0, 1).toUpperCase();
    },
    // 将人员分组存储
    genTeamData() {
      const teamMap = new Map();
      this.allEngineer.forEach(item => {
        if (teamMap.has(item.teamId)) {
          const team = teamMap.get(item.teamId);
          team.children.push(item);
          teamMap.set(item.teamId, team);
        } else {
          let teamData = {};
          if (!item.teamId) {
            teamData = {
              id: `team-${item.teamId}`,
              teamId: item.teamId,
              name: '未分组',
              disabled: true,
              isTeam: true,
              children: [
                item,
              ], };
          } else {
            teamData = {
              id: `team-${item.teamId}`,
              name: item.teamName,
              teamId: item.teamId,
              isTeam: true,
              disabled: this.teamDisabled,
              children: [
                item,
              ],
            };
          }
          teamMap.set(item.teamId, teamData);
        }
      });
      // 将未分组数据放在最后
      const NullTeam = teamMap.get(null);
      teamMap.delete(null);
      if (NullTeam) {
        teamMap.set(null, NullTeam);
      }

      this.teamEngineer = [
        ...teamMap.values(),
      ];
    },
    // 根据首字母进行数据筛选
    filterTeamEngineerByFirstLetter(engineerData, firstLetter) {
      const res = [];
      engineerData.forEach(item => {
        const temp = { ...item, };
        if (temp.isTeam) {
          temp.children = this.filterTeamEngineerByFirstLetter(temp.children, firstLetter);
          res.push(temp);
        }
        if (temp.letter === firstLetter) {
          res.push(temp);
        }
      });
      return res;
    },
    // 对树节点进行筛选时执行
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleChangeFirstLetter(firstLetter) {
      this.selectedFirstLetter = firstLetter;
    },
    handleNodeChange(data) {
      this.checkedList = [];
      this.checkedList[0] = data;
    },
    // 处理传入的默认选项
    dealWithDefaultSelectedData() {
      if (this.defaultSelectedData.isTeam) {
        this.radio = `team-${this.defaultSelectedData.teamId}`;
      } else {
        this.radio = `engineer-${this.defaultSelectedData.teamId}-${this.defaultSelectedData.engineerId}`;
      }

      this.$nextTick(() => {
        this.$refs['radio-' + this.radio]?.handleChange();
      });
    },
    // 确认选择
    confirm() {
      const data = this.checkedList[0];
      if (data) {
        const isTeam = data.isTeam;
        const result = {
          isTeam,
          name: data.name,
        };
        if (isTeam) {
          result.teamId = data.teamId;
          result.engineerId = null;
        } else {
          result.teamId = data.teamId;
          result.engineerId = data.engineerId;
        }
        this.$emit('done', result);
      } else {
        this.$message({
          type: 'error',
          message: '请选择工程师',
        });
      }
    },
    // 点击小组跳转定位
    scrollToAnchor(item, index) {
      console.log('定位对象', item);
      this.activatedItem = index;
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', });
      }
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
    width: 50%;
    padding-bottom: 16px;
  }
  .letter {
    padding-bottom: 16px;
    ::v-deep .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 18px;
    }
    .active {
      color: white;
      background-color:#409EFF;
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
.footer {
  height: 64px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.pure-team-label {
  font-size: 14px;
}
.radio {
  ::v-deep .el-radio__label{
    @include font_color_imp('color-text-main');
  }
}
.nav {
  border-right: 1px solid;
  @include border_color_imp('color-stroke');
  text-align: right;
  .item {
    display: block;
    @include font_color_imp('color-assist-gray');
    font-size: 14px;
    padding: 5px 16px 5px 0;
    margin: 8px 0;
    cursor: pointer;
    &.activated {
      border-right: 1px solid;
      @include font_color_imp('color-primary');
    }
  }
}
.tip {
  font-size: 14px;
  @include font_color_imp('color-special');
  background-color:  #FFFCEF;
  padding: 5px;
  width: 100%;
  display: inline-block;
  margin-right: 16px;
}
</style>
