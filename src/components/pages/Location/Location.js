import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Location.css'; // 위의 CSS 파일 연결

const Location = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const saveLocationAndNavigate = async () => {
      try {
        // 위치 정보 가져오기
        const location = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('이 브라우저는 Geolocation API를 지원하지 않습니다.'));
          } else {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              (error) => reject(error)
            );
          }
        });

        console.log('위치 정보:', location);

        // 서버에 위치 저장 요청
        const response = await axios.post(
          'http://localhost:8080/user/save-location',
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          { withCredentials: true } // 세션 인증 정보 포함
        );

        if (response.status === 200 && response.data === 'SUCCESS') {
          console.log('위치 저장 성공');
        } else {
          console.error('위치 저장 실패');
        }
      } catch (error) {
        console.error('위치 저장 오류:', error.response?.data || error.message);
        alert('위치 정보를 저장하는 데 실패했습니다.');
      } finally {
        navigate('/main'); // 위치 저장 완료 후 main 페이지로 이동
      }
    };

    saveLocationAndNavigate();
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      로딩 중...
    </div>
  );
};

export default Location;
