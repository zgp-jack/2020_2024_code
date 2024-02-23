const API_PORT = '3000';
const API_SERVER_PORT = '18080';

const API_ROOT = `https://192.168.20.13:${API_PORT}`;
const API_SERVER_ROOT = `http://192.168.20.31:${API_SERVER_PORT}`;

const DEFAULT_ICE_SERVER = {
    url: 'turn:47.52.156.68:3478',
    credential: 'zmecust',
    username: 'zmecust'
};

module.exports = { API_PORT, API_ROOT, DEFAULT_ICE_SERVER, API_SERVER_PORT, API_SERVER_ROOT };
