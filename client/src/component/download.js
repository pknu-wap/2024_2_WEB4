import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from './config';

function Download() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);

  const navigateToMain = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/ganz/download`); 
        const data = await response.json();
        setImageUrl(data.imageUrl); 
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'downloaded-image.jpg'
      link.click(); 
    } else {
      console.error('No image URL available for download');
    }
  };

  return (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt="Downloaded from server" style={{ maxWidth: '100%', height: 'auto' }} />
      ) : (
        <p>Loading image...</p>
      )}
      <div className="buttonSet">
        <button id="downloadButton" onClick={handleDownload}>
          다운로드!
        </button>
        <button id="mainButton" onClick={navigateToMain}>
          메인화면으로
        </button>    
      </div>
    </>
  );
}

export default Download;
