
export const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    TOKEN: `${API_BASE_URL}/api/token/`,
    REGISTER: `${API_BASE_URL}/api/register/`,
    KITS: `${API_BASE_URL}/api/kits/`,
    RESULTS: `${API_BASE_URL}/api/results/`,
    TICKETS: `${API_BASE_URL}/api/tickets/`,
    ACTIVATION_REQUESTS: `${API_BASE_URL}/api/activation-requests/`,
    PING: `${API_BASE_URL}/api/ping/`,
    DOWNLOAD: `${API_BASE_URL}/api/download/`,
    UPLOAD: `${API_BASE_URL}/api/upload/`,
};

export const API_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY_HERE', // TODO: Update with your actual Google Maps API Key
};
