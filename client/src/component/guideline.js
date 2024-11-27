import React, { useState } from "react";
import help1 from "../const/help1.png"
import help2 from "../const/help2.png"
import help3 from "../const/help3.png"
import help4 from "../const/help4.png"
import help5 from "../const/help5.png"
import warning from "../const/warning.png"

function Guideline() {

    const data = [
      { image: warning, description: [
        '!!!여권 사진 사용을 적극 권장합니다.!!!',
        '!!!깨끗한 배경, 이마, 눈썹, 얼굴이 잘 드러날 수록 좋습니다.!!!',
        '전신 사진을 사용하지 마십시오.', 
        '안경 등 악세사리는 지양해주세요.',
        '셀카도  잘 안 될 수 있습니다.',
      ] },
      { image: help1, description: [
        '① 본인 사진을 선택합니다.',
        '② 원하는 헤어 스타일을 선택합니다.', 
        '③ 염색을 하려면 체크하세요.'
      ] },
      { image: help2, description: [
        '④ 염색을 하지 않을 경우: 생성하기를 누르세요.',
      ] },
      { image: help3, description: [
        '⑤ 염색을 하는 경우 : 염색 스타일을 지정하세요.',
        '⑥ 생성하기를 누르세요.'] },
      { image: help4, description: [
        '로딩 중입니다. 보통 로딩은 1분 내외로 정도 소모됩니다.'
      ] },
      { image: help5, description: [
        '⑦ 미리보기 이미지입니다.',
        '⑧ 다운로드 화면에 대한 QR 코드입니다.',
        '⑨ 다운로드 버튼입니다.',
        '⑩ 다시 메인화면으로 돌아가는 화면입니다.'
      ] },
    ];
  
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };
  
    const handlePrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };
  
    return (
      <div style={{ textAlign: 'center'}}>
        <a href="/" className="mainButton">메인화면으로</a>
        <img
          src={data[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          style={{
            height: '40vh', 
            width: 'auto', 
            display: 'block', 
            margin:  '0 auto',
          }}
        />

        {data[currentIndex].description.map((line, index) => (
            <p className="description" key={index}>{line}</p>
          ))}
  
        <div>
        <button 
          onClick={handlePrevious} 
          className="arrowButton"
        >
          ◀
        </button>
        <button 
          onClick={handleNext} 
          className="arrowButton"
        >
          ▶
        </button>
      </div>

    </div>
    );
  };
  
export default Guideline;