import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from './config';

function Main() {
  const [inputImageName, setInputImageName] = useState("선택된 파일 없음");
  const [targetImageName, setTargetImageName] = useState("선택된 파일 없음");
  const [inputFile, setInputFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const navigate = useNavigate();

  const navigateToLoading = () => {
    // 파일 업로드 및 서버 요청 함수 호출
    uploadImages();
    navigate("/loading");
  };
  
  const handleFileChange = (event, setFileName, setFile, setFileSelected) => {
    const file = event.target.files[0];
    if (file) {
      setFileName("파일 이름: " + file.name);
      setFile(file);
    } else {
      setFileName("선택된 파일 없음");
      setFile(null);
    }
  };

  const uploadImages = async () => {
    if (!inputFile || !targetFile) {
      console.error("모든 파일을 선택해야 합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("files", inputFile);
    formData.append("files", targetFile);

    try {
      const response = await fetch(`${SERVER_URL}/ganz/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("서버 응답:", data);
        navigate("/loading"); // 성공적으로 업로드 후 로딩 페이지로 이동
      } else {
        console.error("파일 업로드 실패:", response.statusText);
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
  };

  return (
    <>
      <p>미용실 갈 때 머리 고민하지 마세요!</p>
      <p> 1) 본인 사진😺과</p>
      <p> 2) 원하는 스타일😍만 보여주시면,</p>
      <p><i style={{ fontWeight: 'bold' }}>GAN-Z</i> 나는 당신의 모습😻을 확인할 수 있어요.</p>

      <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label 
            htmlFor="inputImage" 
            className={`custom-file-upload ${inputFile ? "selected" : ""}`}
          >                
            본인 사진😺 선택
          </label>
          <input
            type="file"
            id="inputImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setInputImageName, setInputFile)}
            style={{ display: "none" }}
          /><br/>
          <span className="file-name">{inputImageName}</span>
        </div>

        <div>
          <label 
            htmlFor="targetImage" 
            className={`custom-file-upload ${targetFile ? "selected" : ""}`}
          >                
            원하는 스타일😍 선택
          </label>
          <input
            type="file"
            id="targetImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setTargetImageName, setTargetFile)}
            style={{ display: "none" }}
          /><br/>
          <span className="file-name">{targetImageName}</span>
        </div>
        
        {inputFile && targetFile && (
          <button 
            id="submitButton"
            type="button" // prevent form submission
            onClick={navigateToLoading}>
              생성하기😻
          </button>
        )}
      </form>
    </>
  );
}

export default Main;
