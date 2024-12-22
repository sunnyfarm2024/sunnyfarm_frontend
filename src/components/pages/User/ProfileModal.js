import React, { useState } from 'react';
import './ProfileModal.css';
import ProfileTab from './ProfileTab'; // 프로필 탭 컴포넌트
import GuestTab from '../Guest/GuestTab'; // 방명록 탭 컴포넌트
import closeButtonImage from '../../assets/button/closeBtn.png'; // 닫기 버튼 이미지
import profileBtn from '../../assets/images/profile/profileBtn.png'; // 활성 프로필 버튼 이미지
import nonProfileBtn from '../../assets/images/profile/non-profileBtn.png'; // 비활성 프로필 버튼 이미지
import guestBtn from '../../assets/images/profile/guestBtn.png'; // 활성 방명록 버튼 이미지
import nonGuestBtn from '../../assets/images/profile/non-guestBtn.png'; // 비활성 방명록 버튼 이미지
import logoutBtn from '../../assets/images/profile/logoutBtn.png'; // 활성 로그아웃 버튼 이미지
import nonLogoutBtn from '../../assets/images/profile/non-logoutBtn.png'; // 비활성 로그아웃 버튼 이미지
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileModal = ({ user, farm, onClose, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 기본 탭 설정
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 로그아웃 진행 상태
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true); // 로그아웃 상태 활성화
    try {
      await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
      alert('로그아웃되었습니다.');
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error.response?.data || error.message);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false); // 로그아웃 상태 해제 (실패 시 복구)
    }
  };

  // 탭 내용 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab 
                user={user} 
                farm={farm} 
                onProfileUpdate={onProfileUpdate} 
        />; 
      case 'guest':
        return <GuestTab user={user} />; // GuestTab에 필요한 props 전달
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>
          <img src={closeButtonImage} alt="닫기 버튼" />
        </button>

        {/* 탭 콘텐츠 */}
        <div className="tab-modal-content">{renderContent()}</div>

        {/* 탭 버튼 */}
        <div className="modal-tabs">
          <button
            className="modal-tab"
            onClick={() => !isLoggingOut && setActiveTab('profile')}
            disabled={isLoggingOut} // 로그아웃 중 중복 클릭 방지
          >
            <img
              src={isLoggingOut ? nonProfileBtn : activeTab === 'profile' ? profileBtn : nonProfileBtn}
              alt="프로필 탭"
            />
          </button>
          <button
            className="modal-tab"
            onClick={() => !isLoggingOut && setActiveTab('guest')}
            disabled={isLoggingOut} // 로그아웃 중 중복 클릭 방지
          >
            <img
              src={isLoggingOut ? nonGuestBtn : activeTab === 'guest' ? guestBtn : nonGuestBtn}
              alt="방명록 탭"
            />
          </button>
          <button
            className="modal-tab"
            onClick={handleLogout}
            disabled={isLoggingOut} // 로그아웃 중 중복 클릭 방지
          >
            <img
              src={isLoggingOut ? logoutBtn : nonLogoutBtn} // 로그아웃 상태에 따라 이미지 변경
              alt="로그아웃 버튼"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
