
import { Message, } from 'element-ui';
import Store from '@/store';

/**
 * 默认支持预览的格式
 */
export const defaultSupportPreviewFormat = /(.jpg|.png|.jpeg|.svg|.gif|.docx|.pdf|.xls|.xlsx|.mp4|.mp3|.avi|.bmp|.doc|.txt)/g;

/**
 * 附件预览
 * @param {*} fileUrl
 * @param {*} fileName
 * @param {*} previewUrl
 */
export default function preview(fileUrl, fileName) {
  const browserUrlOrigin = window.location.origin;
  const defaultPreviewUrl = ` ${browserUrlOrigin}/preview/onlinePreview?url=`;
  if (defaultSupportPreviewFormat.test(fileName) || defaultSupportPreviewFormat.test(fileUrl)) {
    const fetchUrl = `${browserUrlOrigin}/ywt/busLocalFile/getFile/${fileUrl}?token=${Store.state.login.accessToken}`;
    console.log(fetchUrl, 'fetchUrl');
    window.open(defaultPreviewUrl + encodeURIComponent(window.btoa(fetchUrl)));
  } else {
    Message.error('该文件暂不支持预览!');
  }
}
