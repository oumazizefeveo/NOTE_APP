import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL.replace(/\/$/, '')}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use(config => {
  const token = localStorage.getItem('notes_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('notes_token');
    }
    return Promise.reject(error);
  }
);

// Upload API functions
export const uploadAPI = {
  uploadFiles: async (noteId: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    return api.post(`/upload/${noteId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getAttachments: async (noteId: string) => {
    return api.get(`/upload/${noteId}`);
  },

  deleteAttachment: async (noteId: string, attachmentId: string) => {
    return api.delete(`/upload/${noteId}/${attachmentId}`);
  }
};
