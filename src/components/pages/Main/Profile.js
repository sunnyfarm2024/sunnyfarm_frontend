import React from 'react';
import MainProfileImage from '../../assets/images/profile/MainProfile.png';
import './Profile.css'; 

const Profile = ({ user, onProfileClick }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  // 이미지 경로 처리
  const profileImageSrc = user.profile.startsWith('http') 
    ? `${user.profile}?t=${Date.now()}`  // 전체 URL이면 그대로 사용
    : `http://localhost:8080${user.profile}?t=${Date.now()}`; // 상대 경로면 호스트 추가

  
  return (
    <div className="profile-container" onClick={onProfileClick}>
      {/* 프로필 배경 */}
      <img
        src={MainProfileImage}
        alt="메인 프로필 배경"
        className="profile-background"
      />
      {/* 프로필 사진 */}
      {user.profile && (
        <img
          src={profileImageSrc}
          alt="프로필 사진"
          className="main-profile-image"
          onError={(e) => {
            console.error("이미지 로드 실패:", profileImageSrc);
            e.target.src = ""; // 오류 시 대체 이미지 처리
          }}
        />
      )}
      {/* 유저 타이틀 */}
      {user.title && (
        <p className="profile-title text-outline" data-content={user.title}>
          {user.title}
        </p>
      )}
      {/* 유저 이름 */}
      {user.userName && (
        <p className="profile-username text-outline" data-content={user.userName}>
          {user.userName}
        </p>
      )}

    </div>
  );
};

export default Profile;
