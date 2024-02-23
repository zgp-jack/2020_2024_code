import { divide, multiply, } from 'lodash-es';

// 获取显示器PPI
export const PPI = () => {
  const widthInches = window.screen.width / window.screen.availWidth;
  const heightInches = window.screen.height / window.screen.availHeight;
  const diagonalInches = Math.sqrt(widthInches ** 2 + heightInches ** 2);
  const PPI = Math.round(Math.sqrt(window.screen.width ** 2 + window.screen.height ** 2) / diagonalInches);
  return PPI;
};

// 获取DPI
export const DPI = () => {
  var arrDPI = [];
  if (window.screen.deviceXDPI !== undefined) {
    arrDPI[0] = window.screen.deviceXDPI;
    arrDPI[1] = window.screen.deviceYDPI;
  } else {
    var tmpNode = document.createElement('DIV');
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
    document.body.appendChild(tmpNode);
    arrDPI[0] = parseInt(tmpNode.offsetWidth);
    arrDPI[1] = parseInt(tmpNode.offsetHeight);
    tmpNode.parentNode.removeChild(tmpNode);
  }
  return arrDPI;
};

// 毫米单位转为像素单位 mm=>px
export const mmToPx = (mm) => {
  console.log(PPI(), 'ppi');

  return divide(multiply(mm, DPI()[0]), 25.4);
};
