import Fetch from '@/utils/fetch';
import Store from '@/store';
export const uploadFile = (file) => Fetch.post('/busLocalFile/upload', { file, });

export const getFile = (url) => Fetch.get(`/busLocalFile/getFile/${url}?token=${Store.state.login.accessToken}`, { params: {}, responseType: 'blob', });
