import _ from 'lodash';
import { mapActions, mapGetters, mapMutations, mapState, } from 'vuex';
import { rules, } from '@/views/project/components/panels/config/form.rules';
import { arrayToTree, } from '@/utils/common';
import { pickerOptions, pickerOptionsEnd, } from '@/views/project/components/panels/config/panel.config';
import UserSelect from '@/views/project/components/userSelect/index';
/**
 * 需求管理主页面
 */
export const mixins_project_index = {
  computed: {

  },
  methods: {
    ...mapMutations('project/index', [
      'SET_PERVIEW',
      'SET_PANCEL_DISABLED',
      'SET_RESEARCH_INFO',
      'SET_ITEM_CODE',
      'SET_PANCEL_EDIT'
    ]),
    ...mapActions('project/index', ['FETCEH_RESET_PANCEL_DISABLED_OPTIONS']),

  },
};
/**
 * 需求信息
 */
export const mixins_needInfo = {
  computed: {
    ...mapState('project/index', {
      pancelDisabledOptions: 'pancelDisabledOptions',
      pancelEditOptions: 'pancelEditOptions',
      expand: (v) => {
        return v['pancelExpandOptions'].needInfo;
      },
    }
    ),

  },
};

/**
 *  调研信息
 */
export const mixins_researchInfo = {
  computed: {
    ...mapState('project/index', {
      disabled: (v) => {
        return v['pancelDisabledOptions'].researchInfo;
      },
      expand: (v) => {
        return v['pancelExpandOptions'].researchInfo;
      },
      isEdit: (v) => {
        return v['pancelEditOptions'].researchInfo;
      },
    }),
  },
};
/**
 * 表单验证规则
 */
export const mixins_rules = {
  data() {
    return {
      rules,
    };
  },
};
/**
 * 基础通用
 */
export const mixins_base = {
  computed: {
    ...mapState('project/index', ['itemCode', 'researchInfo', 'panelGroupData', 'isLookTask']),
    ...mapGetters('project/index', ['getterPanelGroupData']),
    ...mapState('user/center', {
      personList: (v) => {
        return _.uniqBy(v['userList'], 'userId');
      },
    }),
    ...mapState(['dictionary']),
  },
  components: {
    UserSelect,
    CascaderDepartment: () => import('@/feat/system/department/component/departmentCascader'),
  },
  methods: {
    ...mapMutations('project/index', ['SET_INJECT_EVENT', 'SET_PANEL_GROUP_DATA', 'SET_LOOK_TASK']),
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT', 'FETCH_PANEL_DATA']),
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    afterDone(refsName) {
      refsName = refsName instanceof Array ? refsName : [refsName];
      for (const i of refsName) {
        this.$refs[i].blur();
      }
    },
  },
  data() {
    return {
      pickerOptions,
      pickerOptionsEnd,
    };
  },
};

/**
 * 任务列表
 */
export const mixins_task = {
  computed: {
    ...mapState('project/index', {
      taskTreeList: (v) => {
        const d = arrayToTree(Object.values(v['taskListMap']), {
          pfield: 'parentId',
          ufield: 'id',
          sub_name: 'children',
        });
        return d;
      },
    }),
    ...mapGetters('project/index', ['taskList', 'participants', 'checkedTaskIds']),

  },
  methods: {
    ...mapMutations('project/index', ['SET_TASK_LIST', 'SET_TASK_ID']),
  },

};
