import axios from 'axios';

const API_BASE_URL = 'https://meshify.azurewebsites.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for large file processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Get API info
export const getApiInfo = async () => {
  const response = await api.get('/info');
  return response.data;
};

// Upload medical scan images
export const uploadScan = async (files, onUploadProgress) => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append('files', file);
  });

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

// Generate 3D mesh from uploaded scans
export const generateMesh = async (scanId, options = {}) => {
  const response = await api.post('/generate', {
    scan_id: scanId,
    ...options,
  });
  return response.data;
};

// Main meshify endpoint - upload and process in one step
export const meshify = async (files, options = {}, onProgress) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Add processing options
  if (options.threshold) {
    formData.append('threshold', options.threshold.toString());
  }
  if (options.smoothing) {
    formData.append('smoothing', options.smoothing.toString());
  }
  if (options.format) {
    formData.append('format', options.format);
  }

  const response = await api.post('/meshify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress({ stage: 'uploading', progress: percentCompleted });
      }
    },
  });

  return response.data;
};

// Download generated mesh file
export const downloadMesh = (meshId, format = 'obj') => {
  return `${API_BASE_URL}/download/${meshId}?format=${format}`;
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to the server. Please try again later.');
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

export default api;
