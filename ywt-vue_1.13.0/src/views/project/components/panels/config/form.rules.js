const content_min_max = (min = 10, max = 200,) => {
  return {
    max: max,
    min: min,
    message: `长度在${min}到${max}个字符`,
    trigger: 'blur',
  };
};

export const phone_rules = {
  pattern: /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
  message: '请输入正确的电话格式',
  trigger: 'change',
};
const msg = function (msg, type = 'string') {
  return {
    type: type,
    message: msg,
  };
};
export const rules = {
  principalName: [{
    required: true,
    trigger: 'change',
    message: '请选择人员',
  }],
  peopleName: [{
    required: true,
    trigger: 'change',
    message: '请选择人员',
  }],
  user: [{
    required: true,
    trigger: 'change',
    message: '请选择报修人',
  }],
  creatTime: [{
    required: true,
    trigger: 'change',
    message: '请选择时间',
  }],
  deptId: [{
    required: true,
    trigger: 'change',
    message: '请选择报修科室',

  }],
  faultRemark: [{
    required: true,
    trigger: 'change',
    message: '请输入或选择',
  }],
  principal: [{
    required: true,
    message: '请选择负责人',
    trigger: 'blur',
  }, {
    trigger: 'change',
    type: 'number',
  }],
  priority: [{
    required: true,
    trigger: 'change',
    message: '请选择',
  }, {
    type: 'number',
    trigger: 'change',
  }],
  tempId: [{
    required: true,
    trigger: 'change',
    message: '请选择模板',

  }],

  reviewUser: [{
    required: true,
    message: '请选择审核人',
    trigger: 'blur',
  }, {
    trigger: 'change',
    type: 'number',
  }],
  according: [{
    message: '依据不能为空',
    trigger: 'blur',
    required: true,
  }],
  dayTime: [{
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
  }],
  remark: [{
    required: true,
    trigger: 'blur',
    message: '描述不能为空',
  }],
  name: [{
    required: true,
    trigger: 'blur',
    message: '名称不能为空',
  },
  content_min_max(1, 50)
  ],

  title: [{
    required: true,
    trigger: 'change',
    message: '标题不能为空',

  }, content_min_max(1, 100)
  ],
  time: [{
    required: true,
    trigger: 'change',
    validator: (r, v, cb) => {
      if (parseFloat(v) <= 0 || !parseFloat(v)) {
        return cb(new Error('工时不能为0'));
      }
      return cb();
    },
  },
  {
    required: true,
    trigger: 'blur',
    validator: (r, v, cb) => {
      if (parseFloat(v) <= 0 || !parseFloat(v)) {
        return cb(new Error('工时不能为0'));
      }
      return cb();
    },
  }],
  users: [{
    required: true,
    message: '请选择参与人员',
    trigger: 'blur',
  }, {
    trigger: 'change',
    type: 'array',
  }],
  reviewer: [{
    required: true,
    message: '请选择审核人',
    trigger: 'blur',
  }, {
    trigger: 'change',
    type: 'number',
  }],
  enclosure: [{
    required: true,
    trigger: 'change',
    message: '附件不能空',

  }, msg('附件不能空')],
  itemType: [{
    required: true,
    message: '请选择需求类型',

    trigger: 'change',
  }],
  organizer: [{
    required: true,
    trigger: 'change',
    message: '请选择提出科室',

  }],
  sponsor: [{
    required: true,
    trigger: 'change',
    message: '提出人',

  }],
  purpose: [{
    required: true,
    type: 'string',
    trigger: 'blur',
    message: '请填写需求目的',
  },
  content_min_max(1, 99999)
  ],
  place: [{
    required: true,
    type: 'string',
    trigger: 'blur',
    message: '请填写调研地点',
  }],

  outline: [{
    required: true,
    type: 'string',
    trigger: 'blur',
    message: '请填写适用业务场景概述',
  }
  ],
  functions: [{
    required: true,
    type: 'string',
    trigger: 'blur',
    message: '请填写系统功能/相关系统',
  }
  ],

  phone: [{
    required: true,
    trigger: 'change',
    message: '联系电话',

  }, phone_rules],
  level: [{
    required: true,
    trigger: 'change',
    message: '请选择项目优先级',
  }
  ],

  startTime: [{
    required: true,
    trigger: 'blur',
    message: '开始时间不能为空',
  }],
  endTime: [{
    required: true,
    trigger: 'change',
    message: '结束时间不能为空',
  }],

  aboutSystem: [{
    required: true,
    trigger: 'change',
    message: '请选择涉及系统',

  }],
  // title: [{ required: true, trigger: 'change', }, msg('需求标题')],
  faultClass: [{
    required: true,
    trigger: 'change',
    message: '请选择故障分类',

  }],
  faultDesc: [{
    required: true,
    trigger: 'change',
    message: '故障描述',

  }],
  researchHead: [{
    required: true,
    trigger: 'change',
    message: '调研负责人',

  }],
  researchTime: [{
    required: true,
    trigger: 'change',
    message: '调研时间',

  }],
  researchAddr: [{
    required: true,
    trigger: 'change',
    message: '调研地点',

  }],
  needPurpose: [{
    required: true,
    trigger: 'change',
    message: '需求目的',

  }],
  contentDesc: [{
    required: true,
    trigger: 'change',
    message: '适用业务场景概述',

  }],
  contentSystem: [{
    required: true,
    trigger: 'change',
    message: '系统功能/相关系统',

  }],
  projectPriority: [{
    required: true,
    trigger: 'change',
    message: '项目优先级',
  }],
  // type: [{ required: true, trigger: 'change', }, msg('需求类型'), }],
  // type: [{ required: true, trigger: 'change', }, msg('需求类型'), }],
  // type: [{ required: true, trigger: 'change', }, msg('需求类型'), }],
  // type: [{ required: true, trigger: 'change', }, msg('需求类型'), }],

};
