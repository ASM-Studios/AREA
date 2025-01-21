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

const root = {
    ping: `${endpoint}/ping`,
    about: `${endpoint}/about.json`,
};

const auth = {
    login: `${endpoint}/auth/login`,
    register: `${endpoint}/auth/register`,
    health: `${endpoint}/auth/health`,
    twoFactorAuth: {
        generate_totp: `${endpoint}/totp/generate`,
        validate_totp: `${endpoint}/totp/validate`,
        login: `${endpoint}/auth/login/2fa`,
        generate_email: `${endpoint}/mail/generate`,
        validate_mail: `${endpoint}/mail/validate`,
        select: `${endpoint}/2fa/method`,
    },
};

const secret = {
    create: '/secret/create',
    list: '/secret/list',
    delete: '/secret/delete',
};

const user = {
    me: `${endpoint}/user/me`,
    delete: `${endpoint}/user/delete`,
};

const oauth = {
    microsoft: {
        auth: `${endpoint}/oauth/microsoft`,
        bind: `${endpoint}/oauth/bind/microsoft`,
    },
    github: {
        auth: `${endpoint}/oauth/github`,
        bind: `${endpoint}/oauth/bind/github`,
    },
    google: {
        auth: `${endpoint}/oauth/google`,
        bind: `${endpoint}/oauth/bind/google`,
    },
    spotify: {
        auth: `${endpoint}/oauth/spotify`,
        bind: `${endpoint}/oauth/bind/spotify`,
    },
    twitch: {
        auth: `${endpoint}/oauth/twitch`,
        bind: `${endpoint}/oauth/bind/twitch`,
    },
    discord: {
        auth: `${endpoint}/oauth/discord`,
        bind: `${endpoint}/oauth/bind/discord`,
    },
    linkedin: {
        auth: `${endpoint}/oauth/linkedin`,
        bind: `${endpoint}/oauth/bind/linkedin`,
    },
};

const workflow = {
    create: `${endpoint}/workflow/create`,
    list: `${endpoint}/workflow/list`,
    delete: `${endpoint}/workflow/delete`,
    update: `${endpoint}/workflow`,
    get: `${endpoint}/workflow`,
};

export {
    instance,
    instanceWithAuth,
    root,
    auth,
    secret,
    user,
    oauth,
    workflow
};
