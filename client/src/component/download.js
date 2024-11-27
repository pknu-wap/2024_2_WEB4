import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config";
import { QRCodeSVG } from "qrcode.react"; // QR 코드 라이브러리

function Download() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const location = useLocation();

  // URL 쿼리에서 result_path 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
  const resultPath = queryParams.get("results");

  const navigateToMain = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (resultPath) {
        try {
          const response = await fetch(
            `${SERVER_URL}/ganz/download/?result_path=${encodeURIComponent(resultPath)}`
          );

          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImageUrl(imageUrl);
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
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "downloaded-image.jpg";
      link.click();
    } else {
      console.error("No image URL available for download");
    }
  };

  const qrUrl = `${window.location.origin}/download?results=${encodeURIComponent(resultPath)}`;

  return (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt="Downloaded from server" className="downloadImg" />
      ) : (
        <p>Loading image...</p>
      )}
      <div className="qrContainer" style={{ margin: "20px", textAlign: "center" }}>
        <QRCodeSVG 
          value={qrUrl} 
          size={100} 
          bgColor="#ffffff" 
          fgColor="#000000" 
        />
      </div>
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
