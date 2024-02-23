const state = {
  recordTableColumn: [
    {
      label: '资产编号',
      prop: 'assetNumber',
      width: 180,
      minWidth: 180,
    },
    {
      label: '名称',
      prop: 'name',
      width: 140,
      minWidth: 140,
    },
    {
      label: '使用科室',
      prop: 'usingDepartment',
      width: 140,
      minWidth: 140,
    },
    {
      label: '巡检人',
      prop: 'inspector',
      select: true,
      width: 117,
      minWidth: 100,
    },
    {
      label: '巡检时间',
      prop: 'inspectTime ',
      select: true,
      width: 180,
      minWidth: 180,
    },
    {
      label: '巡检结果',
      prop: 'inspectionResults ',
      select: true,
      width: 140,
      minWidth: 140,
    },
    {
      label: '巡检图片',
      prop: 'inspectionPicture ',
      width: 160,
      minWidth: 160,
    }
  ],
  inspectionUnitTableColumn: [
    {
      label: '编号',
      prop: 'number',
      width: 140,
      minWidth: 80,
    },
    {
      label: '巡检单元名称',
      prop: 'name',
      width: 140,
      minWidth: 80,
    },
    {
      label: '所属科室',
      prop: 'department',
      width: 140,
      minWidth: 120,
    },
    {
      label: '维护科室',
      prop: 'maintenanceDepartment',
      width: 140,
      minWidth: 80,
    },
    {
      label: '维保责任人',
      prop: 'personLiable',
      select: true,
      width: 160,
      minWidth: 120,
    },
    {
      label: '巡检类型',
      prop: 'patrolType',
      select: true,
      width: 160,
      minWidth: 100,
    },
    {
      label: '巡检到期时间',
      prop: 'recentInspection',
      select: true,
      width: 178,
      minWidth: 120,
    }
  ],
  assetsTableColumn: [
    {
      label: '资产编号',
      prop: 'assetNumber',
      width: 140,
      minWidth: 140,
    },
    {
      label: '资产类型',
      prop: 'assetType',
      width: 90,
      minWidth: 90,
    },
    {
      label: '名称',
      prop: 'name',
      width: 80,
      minWidth: 80,
    },
    {
      label: '规格型号',
      prop: 'specificationModel',
      width: 80,
      minWidth: 80,
    },
    {
      label: '使用科室',
      prop: 'usingDepartment',
      width: 80,
      minWidth: 80,
    },
    {
      label: '所在位置',
      prop: 'location',
      width: 128,
      minWidth: 100,
    },
    {
      label: '维护科室',
      prop: 'maintenanceDepartment',
      width: 80,
      minWidth: 80,
    },
    {
      label: '维保责任人',
      prop: 'personLiable',
      select: true,
      width: 120,
      minWidth: 120,
    },
    {
      label: '巡检类型',
      prop: 'patrolType',
      select: true,
      width: 100,
      minWidth: 100,
    },
    {
      label: '巡检到期时间',
      prop: 'recentInspection',
      select: true,
      width: 160,
      minWidth: 120,
    }
  ],
  setUpTableColumn: [
    {
      label: '所属科室',
      prop: 'deptIdToName',
      select: true,
      width: 230,
      minWidth: 120,
    },
    {
      label: '模板名称',
      prop: 'templateName',
      width: 230,
      minWidth: 120,
    },
    {
      label: '巡检频次',
      prop: 'inspectionFrequency',
      width: 230,
      minWidth: 120,
    },
    {
      label: '启用',
      prop: 'enable',
      select: true,
      width: 230,
      minWidth: 120,
    },
    {
      label: '异常处理办法',
      prop: 'treatment',
      select: true,
      width: 447,
      minWidth: 120,
    }
  ],
  relationTableColumn: [
    {
      label: '资产编号',
      prop: 'assetNum',
      width: 160,
      minWidth: 120,
    },
    {
      label: '资产类型',
      prop: 'assetType',
      select: true,
      width: 120,
      minWidth: 120,
    },
    {
      label: '名称',
      prop: 'name',
      width: 120,
      minWidth: 120,
    },
    {
      label: '规格型号',
      prop: 'modelNum',
      width: 100,
      minWidth: 100,
    },
    {
      label: '制作商',
      prop: 'manufacturer',
      select: true,
      width: 178,
      minWidth: 120,
    },
    {
      label: '维护科室',
      prop: 'maintenanceDepartment',
      width: 120,
      minWidth: 120,
    },
    {
      label: '使用科室',
      prop: 'usingDepartment',
      width: 120,
      minWidth: 120,
    }
  ],
  inspectionContents: [
    {
      label: '分类',
      prop: 'classification',
      width: 120,
      minWidth: 100,
    },
    {
      label: '巡检内容',
      prop: 'contents',
      width: 130,
      minWidth: 130,
    },
    {
      label: '巡检值域',
      prop: 'range',
      width: 150,
      minWidth: 130,
    },
    {
      label: '实测值',
      prop: 'actual',
      width: 130,
      minWidth: 130,
    },
    {
      label: '最终结果',
      prop: 'result',
      width: 130,
      minWidth: 130,
    },
    {
      label: '整改要求及处罚意见',
      prop: 'opinion',
      width: 338,
      minWidth: 180,
    }
  ],
  addTemplateTableColumn: [
    {
      label: '巡检分类',
      prop: 'templateDetailsName',
      width: 130,
      minWidth: 100,
    },
    {
      label: '巡检内容',
      prop: 'templateDetailsType',
      width: 194,
      minWidth: 130,
    },
    {
      label: '巡检类型',
      prop: 'valueType',
      width: 190,
      minWidth: 130,
    },
    {
      label: '值域',
      prop: 'value',
      width: 140,
      minWidth: 100,
    },
    {
      label: '默认值',
      prop: 'defaultValue',
      width: 130,
      minWidth: 100,
    },
    {
      label: '异常值域',
      prop: 'errValue',
      width: 200,
      minWidth: 130,
    },
    {
      label: '启用',
      prop: 'enable',
      width: 100,
      minWidth: 130,
    },
    {
      label: '填写实测值',
      prop: 'actualValue',
      width: 130,
      minWidth: 130,
    }
  ],
  moduleAssociationTableColumn: [
    {
      label: '资产编号',
      prop: 'assetNumber',
      width: 160,
      minWidth: 130,
    },
    {
      label: '名称',
      prop: 'name',
      width: 130,
      minWidth: 130,
    },
    {
      label: '是否巡检',
      prop: 'isInspection',
      width: 100,
      minWidth: 100,
    },
    {
      label: '巡检模板',
      prop: 'inspectionTemplate',
      width: 180,
      minWidth: 120,
    },
    {
      label: '使用科室',
      prop: 'usingDepartment',
      width: 120,
      minWidth: 120,
    },
    {
      label: '使用责任人',
      prop: 'person',
      width: 120,
      minWidth: 120,
    },
    {
      label: '维护科室',
      prop: 'maintenanceDepartment',
      width: 120,
      minWidth: 120,
    },
    {
      label: '维护责任人',
      prop: 'maintenancePerson',
      width: 120,
      minWidth: 120,
    }
  ],
};
const mutation = {};
const actions = {};
export default {
  namespaced: true,
  state,
  mutation,
  actions,
};
