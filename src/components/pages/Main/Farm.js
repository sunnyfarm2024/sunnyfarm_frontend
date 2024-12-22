import React, { useState, useEffect } from 'react';
import './Farm.css';

const Farm = ({ farm }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (!farm?.gnomeEndsAt) return;

    const gnomeEndTime = new Date(farm.gnomeEndsAt);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = gnomeEndTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingTime('0:00:00');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval); // 정리(cleanup)
  }, [farm?.gnomeEndsAt]);

  const description = farm?.farmDescription || '농장을\n소개해주세요!';

  return (
    <div className="farm-container">
      {/* Sign 이미지와 설명 텍스트 */}
      <div className="sign-container">
        <img
          src={`http://localhost:8080${farm.signImage}`} 
          alt="Sign"
          className="sign-image"
        />
        <div 
          className="farm-description text-outline" 
          data-content={description}>
          {description}
        </div>
      </div>

      {/* Corner 이미지 */}
      {farm?.cornerImage && (
        <img
          src={`http://localhost:8080${farm.cornerImage}`}
          alt="Corner"
          className="corner-image"
        />
      )}

      {/* Gnome 이미지 및 타이머 */}
      {farm?.gnomeImageUrl && remainingTime && (
        <div className="gnome-container">
          <div className="gnome-timer text-outline" data-content={remainingTime}>
            {remainingTime}
          </div>
          <img
            src={`http://localhost:8080${farm.gnomeImageUrl}`}
            alt="Gnome"
            className="gnome-image"
          />
        </div>
      )}
    </div>
  );
};

export default Farm;
