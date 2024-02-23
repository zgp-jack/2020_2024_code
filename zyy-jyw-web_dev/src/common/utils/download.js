import dayjs from 'dayjs';

/**
 * 处理base64
 * 将 base64 转为二进制数据
 */
export const base64ToBinary = (base64) => {
  if (base64) {
    const decodeData = atob(base64);
    const byteArray = new Uint8Array(decodeData.length);
    for (let i = 0; i < decodeData.length; i++) {
      byteArray[i] = decodeData.charCodeAt(i);
    }
    return byteArray;
  }
  return null;
};

/**
 * 文件下载
 * @param fileStream 文件流
 * @param fileName 文件名称
 * @param isDownloadDate 是否在文件名称前面添加下载日期,默认添加
 */
export const downloadFile = (fileStream, fileName, isDownloadDate = true) => {
  const time = isDownloadDate ? dayjs().format('YYYY-MM-DD') : '';
  if (!fileStream) {
    console.error('download: fileStream is required');
    return;
  }
  if (!fileName) {
    fileName = `${time}文件名称.xlsx`;
  } else {
    fileName = `${time}${fileName}`;
  }
  const url = window.URL.createObjectURL(new Blob([
    fileStream,
  ]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // 设置下载文件的名称
  document.body.appendChild(link);
  link.click();
};
