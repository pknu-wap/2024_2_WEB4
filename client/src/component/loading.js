import React, { useState, useEffect } from 'react';
import loadingRing from '../const/loadingring.png'; 

const Loading = () => {
  const [loadingText, setLoadingText] = useState("");
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 4);
    }, 500); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dots = ".".repeat(dotCount);
    setLoadingText(`${dots}`);
  }, [dotCount]);

  return (
    <div id='loadingDiv'>
      <img id="loadingRing" src={loadingRing} alt="Loading" />
      <h2 id='loadingText'><i style={{ fontWeight: 'bold' }}>GAN-Z</i>  나는 당신을 생성중{loadingText}</h2>
    </div>
  );
};

export default Loading;