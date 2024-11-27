import React from "react";
import { useNavigate } from 'react-router-dom';

function Guideline() {
  const navigate = useNavigate();
  const navigateToMain = () => {
    navigate("/");
  };
  return (
    <>
      <a href="/" className="mainButton">메인화면</a>
        <ol className="guidelineOrderedList"> 
          <h1>사용 방법</h1>
          <li>본인사진을 선택해줍니다.</li>
          <li>원하는 헤어 스타일을 선택합니다.</li>
          <li>원하는 헤어 스타일에 염색을 하고 싶다면 염색을 할 거예요!  </li>
          <li></li>
        </ol>
      

    </>
  );
}

export default Guideline;

