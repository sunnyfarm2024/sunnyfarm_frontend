import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 일반 로그인 폼 제출
  const onSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    try {
      // 로그인 요청 보내기
      const response = await axios.post('http://localhost:8080/user/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage('로그인에 성공했습니다.');
        navigate('/location'); 
      }
    } catch (error) {
      console.error('로그인 오류:', error.response?.data || error.message);
      setMessage(error.response?.data || '로그인에 실패했습니다.');
    }
  };

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      // Google OAuth 인증 URL 생성
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=565897051364-h2vll028hdihbm4vo02puhcj182tv616.apps.googleusercontent.com&redirect_uri=http://localhost:8080/user/google-login&scope=email`;
  
      // Google OAuth로 리디렉션
      window.location.href = googleAuthUrl;

    } catch (error) {
      console.error('Google 로그인 오류:', error);
      alert('Google 로그인에 실패했습니다.');
    }
  };
  
  return (
    <div>
      <h2>로그인</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 상태 업데이트
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 상태 업데이트
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button onClick={handleGoogleLogin}>Google 로그인</button>
      <p>
        <Link to="/register">회원이 아니신가요?</Link>
      </p>
    </div>
  );
};

export default Login;