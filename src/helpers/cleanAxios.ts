import axios from 'axios';

const cleanAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default cleanAxios;
