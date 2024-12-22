import React, { useState, useRef } from 'react';
import axios from 'axios';

const UsernameModal = ({ onSetUsername }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(null); // 닉네임 유효성 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const debounceTimer = useRef(null); // 디바운스 타이머 관리

  // 닉네임 중복 확인 함수
  const checkUsernameExists = async (usernameValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/check-username?userName=${usernameValue}`
      );
      return response.data; // 서버가 true/false 반환
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      return true; // 기본적으로 중복된 것으로 처리
    }
  };

  // 닉네임 변경 핸들러
  const handleUsernameChange = (e) => {
    const usernameValue = e.target.value;
    setUsername(usernameValue);

    // 이전 타이머 클리어
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // 닉네임 유효성 초기화
    setMessage('');
    setIsValid(null);

    // 디바운싱: 입력 후 500ms 뒤에 중복 확인 실행
    debounceTimer.current = setTimeout(async () => {
      if (usernameValue.trim() === '') {
        setMessage('닉네임을 입력해주세요.');
        setIsValid(false);
        return;
      }

      const exists = await checkUsernameExists(usernameValue);
      if (exists) {
        setMessage('이미 사용 중인 닉네임입니다.');
        setIsValid(false);
      } else {
        setMessage('사용 가능한 닉네임입니다.');
        setIsValid(true);
      }
    }, 500);
  };

  // 닉네임 저장 함수
  const handleSaveUsername = async () => {
    if (!isValid) {
      setMessage('유효한 닉네임을 입력해주세요.');
      return;
    }
  
    setIsLoading(true); // 로딩 상태 시작
    try {
      const response = await axios.post('http://localhost:8080/user/username',
        { userName: username }, // 요청 본문
        { withCredentials: true, }// 쿠키 전송 
      );
  
      // 서버 반환 값 처리
      if (response.status === 200) {
        setMessage('닉네임이 성공적으로 저장되었습니다.');
        onSetUsername(username); // 부모 컴포넌트(Main)로 닉네임 전달
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setMessage('닉네임 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };
  
  return (
    <div style={modalStyle}>
      <h2>닉네임을 입력해주세요</h2>
      <input
        type="text"
        placeholder="닉네임을 입력하세요"
        value={username}
        onChange={handleUsernameChange} // 디바운싱 적용
        disabled={isLoading} // 로딩 중 입력 비활성화
      />
      <button onClick={handleSaveUsername} disabled={!isValid || isLoading}>
        {isLoading ? '저장 중...' : '완료'}
      </button>
      {message && <p style={{ color: isValid ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

// 간단한 모달 스타일
const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  border: '1px solid #ccc',
  zIndex: 1000,
};

export default UsernameModal;
