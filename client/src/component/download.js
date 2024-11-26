import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from './config';

function Download() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const location = useLocation();

  // URL 쿼리에서 result_path 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
  const resultPath = queryParams.get("results");

  const navigateToMain = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (resultPath) {
        try {
          // 백엔드에서 이미지 직접 전송을 받아오는 방법
          const response = await fetch(`${SERVER_URL}/ganz/download/?result_path=${encodeURIComponent(resultPath)}`);
          
          // Blob 형식으로 이미지를 받아와서 URL 생성
          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob); // Blob 데이터를 URL로 변환
            setImageUrl(imageUrl); // 이미지 URL 상태로 저장
            console.log(imageUrl, resultPath, blob);
          } else {
            console.error("Error fetching image:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImage();
  }, [resultPath]);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'downloaded-image.jpg'; // 다운로드 파일명 지정
      link.click(); // 클릭 이벤트로 다운로드 시작
    } else {
      console.error('No image URL available for download');
    }
  };
  console.log(imageUrl)
  return (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt="Downloaded from server" className='downloadImg' />
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
