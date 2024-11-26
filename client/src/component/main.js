import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from './config';

function Main() {
  const [inputImageName, setInputImageName] = useState("선택된 파일 없음");
  const [targetImageName, setTargetImageName] = useState("선택된 파일 없음");
  const [referenceImageName, setReferenceImageName] = useState("선택된 파일 없음"); 
  const [inputFile, setInputFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null); 
  const [isDyed, setIsDyed] = useState(false); 
  const navigate = useNavigate();

  const navigateToLoading = () => {
    uploadImages();
  };

  const handleFileChange = (event, setFileName, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFileName("파일 이름: " + file.name);
      setFile(file);
    } else {
      setFileName("선택된 파일 없음");
      setFile(null);
    }
  };

  const handleCheckboxChange = () => {
    setIsDyed(!isDyed); // 체크박스 상태 토글
  };

  const uploadImages = async () => {
    if (!inputFile || !targetFile) {
      console.error("모든 파일을 선택해야 합니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append("files", inputFile);
    formData.append("files", targetFile);
    if (isDyed && referenceFile) {
      formData.append("files", referenceFile); 
    }
  
    try {
      const response = await fetch(`${SERVER_URL}/ganz/upload/`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      navigate("/loading");
      console.log(response);
      if (response.ok) {
        const data = await response.json();
  
        // Second API call to /ganz/run/ with the file locations
        try {
          const runResponse = await fetch(`${SERVER_URL}/ganz/inference/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              face_img: data.file_location[0],
              shape_img: data.file_location[1],
              // 염색 여부에 따라 color_img 값 설정
              color_img: isDyed ? data.file_location[2] : data.file_location[1], 
            }),
            mode: 'cors',
          });
  
          console.log(runResponse);
  
          if (runResponse.ok) {
            const runData = await runResponse.json();
            console.log("Run response:", runData);
            navigate(`/download/?results=${runData.result_path}`);
  
          } else {
            console.error("Run 요청 실패:", runResponse.statusText);
          }
        } catch (runError) {
          console.error("서버 오류 (Run 요청):", runError);
        }
      } else {
        console.error("파일 업로드 실패:", response.statusText);
      }
    } catch (uploadError) {
      console.error("서버 오류 (파일 업로드):", uploadError);
    }
  };

  return (
    <>
      <p>미용실 갈 때 머리 고민하지 마세요!</p>
      <p> 1) 본인 사진😺과</p>
      <p> 2) 원하는 스타일😍만 보여주시면,</p>
      <p><i style={{ fontWeight: 'bold' }}>GAN-Z</i> 나는 당신의 모습😻을 확인할 수 있어요.</p>
      <p>"염색은 선택, 스타일은 당신의 몫! 😎"</p>

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

        {/* 염색 여부 체크박스 추가 */}
        <div>
          <input 
            type="checkbox" 
            id="dyedCheckbox" 
            checked={isDyed} 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor="dyedCheckbox">염색을 할 거예요!</label>
        </div>

        {/* 염색이 선택되었을 때만 reference 이미지 파일 업로드 추가 */}
        {isDyed && (
          <div>
            <label 
              htmlFor="referenceImage" 
              className={`custom-file-upload ${referenceFile ? "selected" : ""}`}
            >                
              염색 스타일 선택
            </label>
            <input
              type="file"
              id="referenceImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setReferenceImageName, setReferenceFile)}
              style={{ display: "none" }}
            /><br/>
            <span className="file-name">{referenceImageName}</span>
          </div>
        )}

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

