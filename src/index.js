import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Axios 기본 설정
axios.defaults.withCredentials = true; // 쿠키 허용

// 중복 알림 방지 플래그
let isAlertShown = false;

// Axios 응답 인터셉터 설정
axios.interceptors.response.use(
  response => response, // 정상 응답은 그대로 반환
  error => {
    if (error.response?.status === 401 && !isAlertShown) {
      isAlertShown = true; // 알림 플래그 설정
      alert('로그인이 필요합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동

      // 일정 시간 후 플래그 초기화 (예: 3초)
      setTimeout(() => {
        isAlertShown = false;
      }, 3000);
    }
    return Promise.reject(error);
  }
);

// React 애플리케이션 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();