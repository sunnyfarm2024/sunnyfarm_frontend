import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ProfileTab.css";
import editButtonImage from "../../assets/button/editBtn.png";
import completionButtonImage from "../../assets/button/edit-completionBtn.png";
import TitleSelectionModal from "./TitleSelectionModal"; // 칭호 선택 모달
import profileNameImg from "../../assets/images/profile/profile_name_b.png";
import profileFarmImg from "../../assets/images/profile/profile_farm_b.png";
import titleBtn from "../../assets/images/profile/profile_titleBtn.png";
import star from "../../assets/images/profile/star.png";

const ProfileTab = ({ user, farm, onProfileUpdate }) => {
  const [isEditableUserName, setIsEditableUserName] = useState(false);
  const [isEditableFarmDescription, setIsEditableFarmDescription] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false); // 칭호 모달 상태

  const [userName, setUserName] = useState(user.userName);
  const [title, setTitle] = useState(user.title);
  const [farmDescription, setFarmDescription] = useState(farm.farmDescription || "");
  const [profileImage, setProfileImage] = useState(`http://localhost:8080${user.profile}`);
  const [isLoading, setIsLoading] = useState(false);

  const userNameInputRef = useRef(null);
  const farmDescriptionRef = useRef(null);

  useEffect(() => {
    if (user && user.profile) {
      const updatedProfileImage = user.profile.startsWith("http")
        ? user.profile
        : `http://localhost:8080${user.profile}`;
      console.log("프로필 이미지 업데이트:", updatedProfileImage);
      setProfileImage(updatedProfileImage);
    }
  }, [user]);

  // 닉네임 중복 확인
  const checkUsernameExists = async (usernameValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/check-username?userName=${usernameValue}`
      );
      return response.data;
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      return true;
    }
  };

  // 인풋 토글 기능
  const handleEditToggle = async (isEditable, setEditable, inputRef, fieldType) => {
    if (isEditable) {
      if (fieldType === "userName") {
        if (await checkUsernameExists(userName)) {
          window.alert("이미 사용 중인 닉네임입니다.");
          return;
        }
        await updateUserName();
      } else if (fieldType === "farmDescription") {
        await updateFarmDescription();
      }
      setEditable(false); // 인풋 비활성화
    } else {
      setEditable(true); // 인풋 활성화
      setTimeout(() => inputRef?.current?.focus(), 0); // 커서 이동
    }
  };

  // 닉네임 업데이트
  const updateUserName = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/user/username",
        { userName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        onProfileUpdate({ userName }); // 변경된 닉네임 전달
      }
    } catch (error) {
      window.alert("닉네임 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 농장 소개 업데이트
  const updateFarmDescription = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/farm/farm-description",
        { farmDescription },
        { withCredentials: true }
      );
      if (response.status === 200) {
        onProfileUpdate({ farm: { farmDescription } }); // 변경된 농장 소개 전달
      }
    } catch (error) {
      window.alert("농장 소개글 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 이미지 업데이트
  const updateProfileImage = async (file) => {
    setIsLoading(true); // 로딩 상태 시작
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(
        "http://localhost:8080/user/profile-picture",
        formData,
        {withCredentials: true}
      );
  
      if (response.status === 200) {
        const newProfileImage = `http://localhost:8080${response.data.newProfilePath}?t=${Date.now()}`;       
        console.log("최종 업데이트된 이미지 경로:", newProfileImage);

        setProfileImage(newProfileImage); // 상태 업데이트

        if (onProfileUpdate) {
          onProfileUpdate({ profile: newProfileImage }); // 부모 컴포넌트 상태 업데이트
        } else {
          console.warn("onProfileUpdate가 정의되지 않음");
        }

      } else {
        alert("프로필 사진 변경 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("프로필 사진 변경 실패:", error);
      alert("프로필 사진 변경에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="profile-tab-container">
        <div className="photo-title-name-section">
            {/* 프로필 이미지 */}
            <div className="photo-section">
            <img
                src={profileImage}
                alt="프로필"
                className="profile-photo"
                style={{ backgroundColor: 'white', width: '100px', height: '100px' }} // 크기와 배경 설정
              />

                <button
                    className="photo-edit-button"
                    onClick={() => document.getElementById("profile-image-upload").click()}
                    >
                    <img src={editButtonImage} alt="수정 버튼" className="edit-button-image" />
                </button>
                <input
                    type="file"
                    id="profile-image-upload"
                    style={{ display: "none" }}
                    onChange={(e) => updateProfileImage(e.target.files[0])}
                />
            </div>

            <div className="title-name-section">
            {/* 칭호 변경 */}
            <div className="title-section">
                <div className="title">
                <img src={star} alt="별" className="star-image" />
                <span className="title-text text-outline" data-content={title}>{title}</span>
                </div>
                <button
                className="title-edit-button"
                onClick={() => setIsTitleModalOpen(true)}
                >
                <img src={titleBtn} alt="변경 버튼" className="title-button-image" />
                </button>
            </div>

            {/* 닉네임 수정 */}
            <div className="nickname-section">
                <img src={profileNameImg}
                    className="name-back-img"
                />
                <div className="name-content">
                <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                readOnly={!isEditableUserName}
                className="nickname-input"
                ref={userNameInputRef}
                />
                <button
                className="nickname-edit-button"
                onClick={() => handleEditToggle(isEditableUserName, setIsEditableUserName, userNameInputRef, "userName")}
                >
                <img
                    src={isEditableUserName ? completionButtonImage : editButtonImage}
                    alt={isEditableUserName ? "완료 버튼" : "수정 버튼"}
                    className="edit-button-image"
                />
                </button>
                </div>
            </div>
            </div>
        </div>
      {/* 농장 소개 수정 */}
      <div className="farm-section">
        <img src={profileFarmImg}
            className="farm-back-img"
        />
        <div className="farm-content">
        <input
            type="text"
          value={farmDescription}
          onChange={(e) => setFarmDescription(e.target.value)}
          readOnly={!isEditableFarmDescription}
          className="farm-description-input"
          ref={farmDescriptionRef}
        />
        <button
          className="farm-description-edit-button"
          onClick={() =>
            handleEditToggle(
              isEditableFarmDescription,
              setIsEditableFarmDescription,
              farmDescriptionRef,
              "farmDescription"
            )
          }
        >
          <img
            src={isEditableFarmDescription ? completionButtonImage : editButtonImage}
            alt={isEditableFarmDescription ? "완료 버튼" : "수정 버튼"}
            className="edit-button-image" />
        </button>
        </div>
      </div>

      {/* 타이틀 선택 모달 */}
      {isTitleModalOpen && (
        <TitleSelectionModal
          currentTitle={title}
          onSelect={(newTitle) => {
            setTitle(newTitle);
            setIsTitleModalOpen(false);
          }}
          onClose={() => setIsTitleModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileTab;
