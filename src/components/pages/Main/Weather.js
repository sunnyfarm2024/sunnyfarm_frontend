import React from 'react';
import sunImg from '../../assets/icons/weather/sun.png';
import cloudImg from '../../assets/icons/weather/cloud.png';
import rainImg from '../../assets/icons/weather/rain.png';
import snowImg from '../../assets/icons/weather/snow.png';
import thunderImg from '../../assets/icons/weather/thunder.png';
import './Weather.css';

const Weather = ({ weather }) => {
  const {
    temperature,
    skyStatus,
    precipitationType,
    windSpeed,
    lightning
  } = weather;

  // 우선순위에 따라 이미지 설정
  let weatherImage;

  if (lightning > 10) {
    weatherImage = thunderImg; // 낙뢰가 가장 우선
  } else if (precipitationType === '1' || precipitationType === '2') {
    weatherImage = rainImg; // 비
  } else if (precipitationType === '3') {
    weatherImage = snowImg; // 눈
  } else if (skyStatus === '1') {
    weatherImage = sunImg; // 맑음
  } else {
    weatherImage = cloudImg; // 흐림
  }

  // 경고문 설정
  const warnings = [];
  if (windSpeed > 10) warnings.push('풍속');
  if (lightning > 10) warnings.push('낙뢰');

  // 경고문 문자열 결합 (쉼표로 구분 후 마지막에 "위험" 추가)
  const warningMessage = warnings.length > 0 ? `${warnings.join(', ')} 위험` : null;

  return (
    <div className="weather-container">
      {/* 기온과 날씨 이미지를 수평으로 배열 */}
      <div className="temperature-image-container">
        <div className="temperature text-outline" data-content={`${temperature}°C`}>
          {temperature}°C
        </div>
          <img src={weatherImage} alt="Weather Status" className="weather-image" />
      </div>
  
      {/* 경고문 출력 */}
      {warningMessage && <div className="warning">{warningMessage}</div>}
    </div>
  );
  
};

export default Weather;
