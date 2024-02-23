<!--  -->
<template>
  <el-container class="SelectPanel-el-container">
    <el-header class="SelectPanel-el-container-header" height="auto">
      <span class="SelectPanel-el-container-header-title">选择人员</span>
      <Search v-model="searchValue" />
      <el-row>
        <el-col :span="24">
          <ul class="name-py-ul">
            <li
              v-for="v in pinyinArr"
              :key="v"
              class="name-py-ul-li"
              :class="acitve === v ? 'active' : ''"
              @click="clickFilterPY(v)"
            >
              <span> {{ v }} </span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-collapse v-if="treeData.length" v-model="activeNames">
        <el-collapse-item
          v-for="v in treeData"
          :key="v.key"
          :title="v.label"
          :name="v.key"
        >
          <el-checkbox-group
            v-if="multiple"
            v-model="multipleCheckedPeople"
            size="mini"
            class="SelectPanel-el-check-group"
          >

            <span v-for="item in v.children" :key="item.key" class="SelectPanel-el-check-group-span">
              <el-checkbox
                :key="item.key"
                border
                :disabled="disabledValue.includes(item.userID)"
                :label="item.userID"
              >{{ item.label }}</el-checkbox>
            </span>
          </el-checkbox-group>

          <el-radio-group
            v-else
            v-model="radioCheckedPeople"
            size="mini"
            class="SelectPanel-el-check-group"
          >
            <span
              v-for="item in v.children"
              :key="item.key"
              class="SelectPanel-el-check-group-span"
            >
              <el-radio
                :key="item.key"
                border
                :disabled="disabledValue.includes(item.userID)"
                :label="item.userID"
                @change="changeRadio($event, item.label)"
              >{{ item.label }}
              </el-radio>
            </span>
          </el-radio-group>
        </el-collapse-item>
      </el-collapse>

      <el-result v-else icon="info" title="提示" sub-title="获取数据失败，请刷新获取">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="reload">刷新</el-button>
        </template>
      </el-result>
    </el-main>
    <el-footer class="SelectPanel-el-container-footer">
      <el-button size="mini" type="primary" @click="submitChange">
        确认选择
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import _ from 'lodash';
import Pinyin from 'pinyin';
import { mapActions, mapState, } from 'vuex';
export default {
  name: 'SelectPanelHyy',
  components: {
    Search: () => import('@/components/input/search.vue'),
  },
  props: {
    multiple: Boolean,
    disabledValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: [Number, String, Array],
      default: 0,
    },
    groupList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      treeData: [],
      activeNames: [],
      multipleCheckedPeople: [],
      radioCheckedPeople: '',
      radioChekcedPeoleArgument: { name: '', id: '', },
      pinyinArr: [],
      searchValue: '',
      acitve: '全部',
    };
  },

  computed: {
    ...mapState('user/center', ['userList']),

  },
  watch: {
    searchValue: _.debounce(function (n, o) {
      if (n) {
        const filterArr = this.groupList.filter(
          (e) => e.userName.indexOf(n) > -1
        );
        this.getUser(filterArr, false);
      } else {
        this.getUser(this.groupList, false);
      }
    }, 300),
  },
  mounted() {
    this.getUser(this.userList);
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    reload: _.debounce(async function () {
      this.DISPATCHT_GET_USER_LIST();
      this.getUser(this.userList, true);
      this.$emit('reload');
    }, 300),

    // 获取名字首字母
    getFirstLetter(word) {
      return Pinyin(word, { style: Pinyin.STYLE_NORMAL, heteronym: true, })[0][0]
        .substring(0, 1)
        .toUpperCase();
    },
    // 点击首字母过滤
    clickFilterPY(v) {
      this.acitve = v;
      if (v !== '全部') {
        const filterArr = this.userList.filter((e) => e.pinyin === v);
        this.getUser(filterArr, false);
      } else {
        this.getUser(this.userList, false);
      }
    },
    changeRadio(id, name) {
      this.radioChekcedPeoleArgument = { name, id, };
    },

    submitChange() {
      if (this.multiple) {
        const multipleChekcedPeopleArgument = _.filter(this.userList, (v) => {
          return this.multipleCheckedPeople.includes(v.userId);
        });
        const multipleChekcedPeopleArgumentMap = _.map(
          multipleChekcedPeopleArgument,
          (v) => {
            return {
              name: v.userName,
              id: v.userId,
            };
          }
        );
        this.$emit('done', multipleChekcedPeopleArgumentMap);
        return;
      }
      this.$emit('done', this.radioChekcedPeoleArgument);
    },
    renderDefault() {
      if (this.multiple) {
        this.multipleCheckedPeople = this.multipleCheckedPeople.length ? this.multipleCheckedPeople : this.defaultValue;
      } else {
        this.radioCheckedPeople = this.defaultValue;
      }
    },
    async getUser(list, isInit = true) {
      const groupData = {};
      for (const i of list) {
        const groupID = i.teamId || 0;
        const py = this.getFirstLetter(i.userName);
        if (isInit) {
          this.pinyinArr.push(py);
        }
        Object.assign(i, { pinyin: py, });
        if (groupData[groupID]) {
          groupData[groupID].children.push({
            parentID: groupID,
            groupID: groupID,
            userID: i.userId,
            label: i.userName,
            pinyin: py,
            key: `${groupID}-${i.userId}`,
          });
        } else {
          this.activeNames.push(groupID);
          groupData[groupID] = {
            groupID: groupID,
            key: groupID,
            userID: `${groupID}-${i.userId}`,
            label: i.teamName || '无分组',
            children: [
              {
                key: `${groupID}-${i.userId}`,
                pinyin: py,
                parentID: groupID,
                groupID: groupID,
                userID: i.userId,
                label: i.userName,
              }
            ],
          };
        }
      }
      this.treeData = Object.values(groupData).reverse();

      if (isInit) {
        if (this.pinyinArr.length) {
          this.pinyinArr = _.uniq(this.pinyinArr);
          this.pinyinArr.sort();
          this.pinyinArr.unshift('全部');
        }
      }
      this.renderDefault();
    },
  },
};
</script>

<style lang='scss' scoped>
.name {
  &-py {
    &-ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      margin: 4px 0;
      padding: 0;
      &-li {
        border: 1px solid #a3d3ff;
        box-sizing: border-box;
        margin: 0 4px 4px 0;
        padding: 4px 12px;
        text-align: center;
        border-radius: 4px;
        color: #1890ff;
        cursor: pointer;
        &:hover {
          background: #1890ff;
          color: #fff;
        }
        > span {
          display: inline-block;
          padding: 5px 0;
        }
      }
    }
  }
}
.active {
  color: white;
  background-color: #409eff;
}
.SelectPanel-el-container {
  ::v-deep .el-checkbox,
  ::v-deep .el-radio {
    width: 100%;
  }
  &-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &-footer {
    padding: 0;
    display: flex;
    align-items: center;
  }
}
.SelectPanel {
  &-el {
    &-container {
      &-header {
      }
    }
    &-check {
      &-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        &-span {
          display: inline-block;
          margin: 4px 4px;
        }
      }
    }
  }
}

.SelectPanel-el-container-header-title {
  display: block;
  margin-bottom: 4px;
}
</style>
