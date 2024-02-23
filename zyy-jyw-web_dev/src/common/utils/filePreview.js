import request from '@/common/utils/request';
import { Message, } from 'element-ui';

/* 获取预览文件 */
export function previewFile({
  url,
} = {}) {
  return request.get(`/system/file/previewFile`,
    {
      params: {
        url,
      },
    });
}

/**
 * 默认支持预览的格式
 */
export const defaultSupportPreviewFormat = /(.jpg|.png|.jpeg|.svg|.gif|.docx|.pdf|.xls|.xlsx|.mp4|.mp3|.avi|.bmp|.doc|.txt)/g;

/**
 * 附件预览
 * @param {*} fileUrl
 * @param {*} fileName
 */
export function FilePreview(fileUrl, fileName) {
  const browserUrlOrigin = window.location.origin;
  console.log(browserUrlOrigin);
  if (defaultSupportPreviewFormat.test(fileName) || defaultSupportPreviewFormat.test(fileUrl)) {
    const param = {
      url: fileUrl,
    };
    previewFile(param).then((res) => {
      if (res) {
        console.log(res);
        window.open(res);
      }
    }
    );
  } else {
    Message.error('该文件暂不支持预览!');
  }
}
