import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:5000/api', // Android emulator; change for physical device
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// For iOS simulator use: http://localhost:5000/api
// For physical device use your local IP: http://192.168.x.x:5000/api

export default api;
