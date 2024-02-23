import Attachment from '@/views/project/components/attachment/attachment.vue';
import { member, stringifyToArr, } from '@/filters';
import { tableCellIconData, } from '@/views/project/common';
const icons = {
  file: require('@/assets/project/icons/file.svg'),
};

export default {
  data() {
    return {
      tableColumn: [{
        label: '序号',
        overflow: true,
        type: 'index',
        width: '60px',
        fixed: true,
      }, {
        label: '子任务名称',
        fixed: true,
        overflow: true,
        prop: 'taskName',
        width: 'auto',

      }, {
        label: '责任人',
        fixed: false,
        overflow: true,
        prop: 'leaderUser',
        width: '100px',
        formatter: (v) => {
          return member(v['leaderUser']);
        },

      }, {
        label: '参与人',
        fixed: false,
        overflow: true,
        prop: 'partUser',
        width: '140px',
        formatter: (v) => {
          let users = [];
          if (v['partUserJson'] && v['partUserJson'].length) {
            users = v['partUserJson'];
          } else if (v['partUser'] && v['partUser'].length) {
            users = v['partUser'];
          } else {
            users = [];
          }
          return member(users);
        },
      }, {
        label: '开始时间',
        fixed: false,
        overflow: true,
        prop: 'planStartDate',
        width: '120px',

      }, {
        label: '结束时间',
        fixed: false,
        overflow: true,
        prop: 'planEndDate',
        width: '120px',
      }, {
        label: '完成比',
        fixed: 'right',
        overflow: true,
        prop: 'compRate',
        width: '85px',
        formatter: (v) => {
          return (v['compRate'] || '0') + '%';
        },
      }, {
        label: '附件',
        fixed: 'right',
        prop: 'attachment',
        width: '60px',
        overflow: false,
        formatter: (v) => {
          const num = stringifyToArr(v['attachment']).length;
          return tableCellIconData(icons.file, num, v['attachment'], Attachment, '附件');
        },
      }
      ],

      rules: {
        taskName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur',
          }
        ],
        level: [
          {
            required: true,
            message: '请选择紧急程度',
            trigger: 'blur',
          }
        ],
        giveTime: [
          {
            required: true,
            message: '请选择提出时间',
            trigger: 'blur',
          }
        ],
        giveUser: [
          {
            required: true,
            message: '请选择提出人',
            trigger: 'change',
          }
        ],
        leaderUser: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          }
        ],
        planDate: [
          {
            required: true,
            message: '请选择计划时间',
            trigger: 'blur',
          }
        ],
        planDays: [
          {
            trigger: 'blur',
            required: true,
            validator: (r, v, cb) => {
              if (parseFloat(v) <= 0 || v === '') {
                return cb(new Error('工时不能为空或者小于0'));
              }
              cb();
            },
          }, {
            trigger: 'change',
            type: 'number',
            transform: (v) => Number(v),
          }
        ],
        auditUser: [
          {
            required: true,
            message: '请选择审核人',
            trigger: 'change',
          }
        ],
        officeId: [
          {
            required: true,
            message: '请选择科室',
            trigger: 'blur',
          }
        ],
      },
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
