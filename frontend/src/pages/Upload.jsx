import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileImage, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './Upload.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://meshify.azurewebsites.net';

const Upload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dicom', '.dcm', '.nii', '.nii.gz']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(f => {
        formData.append('images', f.file);
      });

      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');

      // Store the response data for the viewer
      localStorage.setItem('meshifyData', JSON.stringify({
        jobId: response.data.job_id || 'demo-job',
        files: files.map(f => f.name),
        timestamp: new Date().toISOString()
      }));

      setTimeout(() => {
        navigate('/viewer');
      }, 1500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploadStatus('error');
      
      // For demo purposes, still navigate to viewer
      localStorage.setItem('meshifyData', JSON.stringify({
        jobId: 'demo-job-' + Date.now(),
        files: files.map(f => f.name),
        timestamp: new Date().toISOString(),
        demo: true
      }));
      
      setTimeout(() => {
        navigate('/viewer');
      }, 2000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <motion.div 
          className="upload-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="upload-title">Upload Medical Scan</h1>
          <p className="upload-description">
            Upload your CT, MRI, X-Ray or other medical imaging files to generate 3D visualizations
          </p>
        </motion.div>

        <motion.div 
          className="upload-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Dropzone */}
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''} ${files.length > 0 ? 'has-files' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="dropzone-icon">
                <UploadIcon size={48} />
              </div>
              <h3 className="dropzone-title">
                {isDragActive ? 'Drop files here' : 'Drag & drop your files'}
              </h3>
              <p className="dropzone-text">
                or <span className="dropzone-link">browse</span> to choose files
              </p>
              <p className="dropzone-hint">
                Supports: PNG, JPG, DICOM, NIfTI (Max 50MB per file)
              </p>
            </div>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                className="file-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="file-list-title">Selected Files ({files.length})</h3>
                {files.map((file) => (
                  <motion.div 
                    key={file.id}
                    className="file-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="file-preview">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} />
                      ) : (
                        <FileImage size={24} />
                      )}
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button 
                      className="file-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div 
                className="upload-progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <Loader className="spinner" size={20} />
                  <span>Processing your scan... {uploadProgress}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Messages */}
          <AnimatePresence>
            {uploadStatus === 'success' && (
              <motion.div 
                className="status-message success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CheckCircle size={24} />
                <span>Upload successful! Redirecting to 3D viewer...</span>
              </motion.div>
            )}
            {error && (
              <motion.div 
                className="status-message info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AlertCircle size={24} />
                <span>Demo mode: Showing sample 3D visualization...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Button */}
          <motion.button 
            className="upload-btn"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploading ? (
              <>
                <Loader className="spinner" size={20} />
                Processing...
              </>
            ) : (
              <>
                <UploadIcon size={20} />
                Generate 3D Model
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Info Cards */}
        <motion.div 
          className="upload-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="info-card">
            <h4>Supported Formats</h4>
            <p>DICOM (.dcm), NIfTI (.nii), PNG, JPEG, and more medical imaging formats</p>
          </div>
          <div className="info-card">
            <h4>Privacy First</h4>
            <p>Your data is processed securely and never stored permanently on our servers</p>
          </div>
          <div className="info-card">
            <h4>Quick Processing</h4>
            <p>Advanced AI generates 3D models in under 30 seconds</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
