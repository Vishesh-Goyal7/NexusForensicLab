import React, { useRef, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const fileInputRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file) => {
    if (!file.type.includes('tiff') && !file.name.endsWith('.tif')) {
      setError('Please upload a .tif file');
      setErrorDetails('Accepted formats: .tif, .tiff');
      return;
    }

    setError('');
    setErrorDetails('');
    setProcessing(true);
    setOriginalImage(null);
    setEnhancedImage(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post(
        "http://localhost:1234/api/denoise",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if(!data) console.log("You are an idiot");
      if(data) console.log("It is done");

      setOriginalImage(`data:image/png;base64,${data.originalImage}`);
      setEnhancedImage(`data:image/png;base64,${data.processedImage}`);
    } catch (error) {
      setError(error.message || 'Failed to process image. Please try again.');
      setErrorDetails(error.cause || '');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="app">
      <div className="scanner-lines"></div>

      <header className="header">
        <div className="header-content">
          <div className="logo">NEXUS Forensic Lab</div>
          <div className="status-bar">
            <div className="status-item">
              <div className="status-dot"></div>
              <span>System Online</span>
            </div>
            <div className="status-item">
              <div className="status-dot"></div>
              <span>AI Model Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        <h1 className="section-title">Fingerprint Enhancement Division</h1>

        <div className="lab-grid">
          <div className="panel">
            <div className="panel-header">Upload Fingerprint</div>
            <div
              className="upload-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileClick}
            >
              <div className="upload-icon">📁</div>
              <div className="upload-text">Drag & Drop your .tif fingerprint image here</div>
              <div className="upload-subtext">or click to browse</div>
              <input
                type="file"
                accept=".tif,.tiff"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {errorDetails && <div className="error-details">{errorDetails}</div>}
            {processing && <div className="processing-message active">Processing image... Please wait.</div>}
          </div>

          <div className="panel">
            <div className="panel-header">Processing Results</div>
            <div className="results-container">
              <div className="image-comparison">
                <div className="image-box">
                  <h3>Original</h3>
                  <div className="image-placeholder">
                    {originalImage ? <img src={originalImage} alt="Original fingerprint" /> : 'No image'}
                  </div>
                </div>
                <div className="image-box">
                  <h3>Enhanced</h3>
                  <div className="image-placeholder">
                    {enhancedImage ? <img src={enhancedImage} alt="Enhanced fingerprint" /> : 'No image'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
