import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Register = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
  } = useForm();

  const password = watch('password', '');
  const passwordConfirm = watch('passwordConfirm', '');

  // 상태 관리
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  // 이메일 중복 확인 함수
  const checkEmailExists = async (emailValue) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/check-email?email=${emailValue}`);
      return response.data; // true 또는 false 반환
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      return false;
    }
  };

  // 이메일 변경 시 호출되는 함수
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;

    clearErrors('email');
    if (emailValue && !errors.email) {
      setTimeout(async () => {
        const exists = await checkEmailExists(emailValue);
        if (exists) {
          setError('email', { type: 'manual', message: '이미 사용중인 이메일입니다.' });
          setEmailAvailable(false);
        } else {
          setEmailAvailable(true);
        }
      }, 500); // 500ms 지연
    } else {
      setEmailAvailable(false);
    }
  };

  // 비밀번호 변경 시 호출되는 함수
  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setValue('password', passwordValue);

    // 비밀번호 유효성 검사 지연
    setTimeout(() => {
      trigger('password').then((isValid) => {
        setPasswordValid(isValid);
      });
    }, 500);
  };

  // 비밀번호 확인 변경 시 호출되는 함수
  const handlePasswordConfirmChange = (e) => {
    const confirmValue = e.target.value;
    setValue('passwordConfirm', confirmValue);

    // 비밀번호 일치 검사 지연
    setTimeout(() => {
      setPasswordMatch(confirmValue === password);
    }, 500);
  };

  // 폼 제출 시 호출되는 함수
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/user/register', data);
      console.log(response.data);

      if (response.status === 200) {
        navigate('/login', { state: { successMessage: '회원가입이 성공적으로 완료되었습니다.' } });
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      console.error('회원가입 오류:', error.response?.data || error.message);
      setMessage(error.response?.data || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            {...register('email', {
              required: '이메일은 필수 입력 사항입니다.',
              pattern: {
                value: /^\S+@\S+$/i,
                message: '유효한 이메일 주소를 입력해주세요.',
              },
              onChange: handleEmailChange, // 이메일 변경 처리
            })}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
          {!errors.email && emailAvailable && <p style={{ color: 'green' }}>사용 가능한 이메일입니다.</p>}
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password', {
              required: '비밀번호는 필수 입력 사항입니다.',
              minLength: {
                value: 8,
                message: '비밀번호는 최소 8자 이상이어야 합니다.',
              },
              onChange: handlePasswordChange, // 비밀번호 변경 처리
            })}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
          {!errors.password && passwordValid && <p style={{ color: 'green' }}>사용 가능한 비밀번호입니다.</p>}
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register('passwordConfirm', {
              required: '비밀번호 확인은 필수 입력 사항입니다.',
              validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
              onChange: handlePasswordConfirmChange, // 비밀번호 확인 변경 처리
            })}
          />
          {errors.passwordConfirm && <p style={{ color: 'red' }}>{errors.passwordConfirm.message}</p>}
          {!errors.passwordConfirm && passwordMatch && <p style={{ color: 'green' }}>비밀번호가 일치합니다.</p>}
        </div>
        <button
          type="submit"
          disabled={
            !!errors.email || !!errors.password || !!errors.passwordConfirm || !emailAvailable || !passwordValid || !passwordMatch
          }
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Register;
