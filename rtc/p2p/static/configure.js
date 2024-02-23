window.configure = {
    API_PORT: '3000',
    API_SERVER_PORT: '18080',

    API_ROOT: `https://192.168.20.13:3000`,
    API_SERVER_ROOT: `http://192.168.20.31:18080`,
    WS_WFS: `wss://192.168.20.13:8002`,
    WS_SERVER: `wss://192.168.20.13:8001`,

    DEFAULT_ICE_SERVER: {
        url: 'turn:47.52.156.68:3478',
        credential: 'zmecust',
        username: 'zmecust'
    }
}
console.log(window.configure)
