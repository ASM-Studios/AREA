import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const endpoint: string = import.meta.env.VITE_ENDPOINT as string;

const instance = axios.create({
    baseURL: endpoint,
    headers: {
        'Content-Type': 'application/json'
    }
});

const instanceWithAuth = axios.create({
    baseURL: endpoint,
    headers: {
        'Content-Type': 'application/json'
    }
});

instanceWithAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jsonWebToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const auth = {
    login: `${endpoint}/auth/login`,
    register: `${endpoint}/auth/register`,
    google: `${endpoint}/auth/google`,
}

export {
    instance,
    instanceWithAuth,
    auth
}
