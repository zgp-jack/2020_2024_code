const API_PORT = '3000';

const API_ROOT = `https://10.132.103.46:${API_PORT}`; //10.132.103.46

const DEFAULT_ICE_SERVER = {
  url: 'turn:10.132.103.46:3478',
  credential: 'hw@2023',
  username: 'hw'
};

module.exports = { API_PORT, API_ROOT, DEFAULT_ICE_SERVER };
