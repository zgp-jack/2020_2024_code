const ElTableStyle = {

  methods: {

    rowStyle({ row, index, }) {
      return {
        background: '#020d18',
      };
    },
    cellClassName({ row, column, rowIndex, columnIndex, }) {
      const isClassProp = ['file'];
      if (isClassProp.includes(column['property'])) {
        return 'bigScreenTaskTableFileCell';
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex, }) {
      let style = {};
      const isPaddingProp = ['file'];
      if (isPaddingProp.includes(column['property'])) {
        style = {
          padding: 0,
          textOverflow: 'initial',
        };
      }
      return {
        background: 'transparent',
        borderBottom: '1px solid rgba(201,229,255,0.10)',
        borderRight: '1px solid rgba(201,229,255,0.10) !important',
        fontSize: '18px',
        fontWeight: 400,
        color: '#fff',
        ...style,
      };
    },
    headerCellStyle({ row, column, rowIndex, columnIndex, }) {
      let textAlign = '';
      const isCenterProp = ['indexNum'];
      if (isCenterProp.includes(column.property)) {
        textAlign = 'center';
      }
      return {
        background: '#3d434b',
        color: '#898d91',
        fontSize: '18px',
        fontWeight: 400,
        borderRight: '1px solid rgba(201,229,255,0.10) !important',
        borderBottom: '1px solid rgba(201,229,255,0.10)',
        textAlign,
      };
    },
    headerRowStyle() {
      return {
        background: 'transparent',
      };
    },
  },
};

export default ElTableStyle;
