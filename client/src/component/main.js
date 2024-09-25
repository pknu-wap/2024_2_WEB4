import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Main() {
  const [inputImageName, setInputImageName] = useState("선택된 파일 없음");
  const [targetImageName, setTargetImageName] = useState("선택된 파일 없음");
  const [inputFileSelected, setInputFileSelected] = useState(false);
  const [targetFileSelected, setTargetFileSelected] = useState(false);
  const navigate = useNavigate();

  const navigateToLoading = () => {
    navigate("/loading");
  };
  
  const handleFileChange = (event, setFileName, setFileSelected) => {
    const file = event.target.files[0];
    if (file) {
      setFileName("파일 이름 :"+file.name);
      setFileSelected(true);
    } else {
      setFileName("선택된 파일 없음");
      setFileSelected(false);
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
                className={`custom-file-upload ${inputFileSelected ? "selected" : ""}`}
                >                
                    본인 사진😺 선택
                </label>
                <input
                type="file"
                id="inputImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setInputImageName, setInputFileSelected)}
                style={{ display: "none" }}
                /><br/>
                <span className="file-name">{inputImageName}</span>
            </div>

            <div>
                <label 
                htmlFor="targetImage" 
                className={`custom-file-upload ${targetFileSelected ? "selected" : ""}`}
                >                
                    원하는 스타일😍 선택
                </label>
                <input
                type="file"
                id="targetImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setTargetImageName, setTargetFileSelected)}
                style={{ display: "none" }}
                /><br/>
                <span className="file-name">{targetImageName}</span>
            </div>
            {inputFileSelected && targetFileSelected && (
                <button 
                  id="submitButton"
                  onClick={navigateToLoading}>
                    생성하기😻
                </button>
            )}
        </form>
    </>
  );
}

export default Main;
