
const tableStyle = {
  cellClassName({ row, column, rowIndex, columnIndex, }) {
    const attachmentClassProp = ['file', 'enclosure', 'attachment', 'meetingNum', 'contractNum', 'applyNum', 'demandEnclosure', 'contractWaitNum'];
    const otherClassProp = ['indexNum'];
    if (attachmentClassProp.includes(column['property'])) {
      return 'table-cell-attachment';
    } else if (otherClassProp.includes(column['property'])) {
      return 'table-cell-index';
    }
  },
  cellStyle: ({ row, column, rowIndex, columnIndex, }) => {
    if (['enclosure', 'attachment', 'applyNum', 'demandEnclosure', 'contractWaitNum'].includes(column['property'])) {
      return {
        padding: 0,
        textOverflow: 'initial',
      };
    }
    return {
      color: '#334266', 'font-size': '18px',
    };
  },
};

export default tableStyle;
