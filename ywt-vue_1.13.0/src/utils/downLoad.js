import { getFile, } from '@/components/upload/api';
import { Loading, Notification, } from 'element-ui';

async function downLoadFile(url, filename, callback, timeout = 5000) {
  if (!url) {
    throw new Error('请求下载地址不能为空');
  }
  if (!filename) {
    throw new Error('文件名称不能为空');
  }
  const loading = Loading.service({
    lock: true,
    text: '请求中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const res = await getFile(url);
    createDownLoad(res, filename, () => {
      loading.close();
      if (callback instanceof Function) {
        callback();
      }
    });
  } catch (err) {
    Notification.error({
      title: '下载出错',
      message: err,
    });
  }
}

function createDownLoad(blob, filename, callback) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    var body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
    if (callback instanceof Function) {
      callback();
    }
  }
}
export default downLoadFile;
