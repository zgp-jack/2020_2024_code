export const config = [
  // {
  //   label: '序号',
  //   property: 'indexNum',
  //   w: '150px',
  // },
  {
    label: '任务名称',
    property: 'name',
    w: '280px',
  }, {
    label: '任务描述',
    property: 'remark',
  }, {
    label: '预计工时',
    property: 'time',
    w: '100px',
    formatter: (row, column, cellValue, index) => {
      if (row.time) {
        return row.time + '天';
      }
      return '-';
    },
  }, {
    label: '操作',
    slot: 'name',
    w: '220px',
  }];

