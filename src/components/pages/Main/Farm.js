import React, { useState, useEffect } from 'react';
import './Farm.css';

const Farm = ({ farm }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [isGnomeActive, setIsGnomeActive] = useState(false);

  useEffect(() => {
    if (!farm?.gnomeEndsAt) {
      setIsGnomeActive(false);
      return;
    }

    const gnomeEndTime = new Date(farm.gnomeEndsAt);
    const now = new Date();

    // 노움이 활성화 여부 결정
    if (gnomeEndTime > now) {
      setIsGnomeActive(true);

      const interval = setInterval(() => {
        const currentTime = new Date();
        const diff = gnomeEndTime - currentTime;

        if (diff <= 0) {
          clearInterval(interval);
          setIsGnomeActive(false); // 타이머가 종료되면 노움 비활성화
          setRemainingTime('0:00:00');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setRemainingTime(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);

      return () => clearInterval(interval); // 정리(cleanup)
    } else {
      setIsGnomeActive(false); // 과거 시간이면 비활성화
    }
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
      {isGnomeActive && remainingTime && (
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
