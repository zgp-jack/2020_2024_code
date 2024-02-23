import Request from '@/common/utils/request';
const login = ({
  username,
  password,
} = {}) => Request.post('/login', {
  username,
  password,
});

const getUserInfo = () => Request.get('/system/user/profile/getInfo');
export default {
  login,
  getUserInfo,
};
