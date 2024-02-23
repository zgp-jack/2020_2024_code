import request from '@/common/utils/request';
import store from '@/store';
export const uploadFile = (file) => request.post('/system/file/upload', { file, });

export const getFile = (url) => request.get(`/system/file/getFile/${url}?token=${store.state.APP_LOGIN.accessToken}`, { params: {}, responseType: 'blob', });
export const filePreview = (url) => request.get(`/system/file/previewFile`, {
  params: { url, },
});
