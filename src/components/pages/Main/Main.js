import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Main.css';
import '../Location/Location.css';

import Profile from './Profile';
import Weather from './Weather';
import Farm from './Farm';
import Plants from './Plants';
import BalanceBar from './BalanceBar';

import UsernameModal from '../User/UsernameModal';
import ProfileModal from '../User/ProfileModal';
import InventoryModal from '../Inventory/InventoryModal';
import FriendModal from '../Friend/FriendModal';
import PlantBookModal from '../PlantBook/PlantBookModal';
import QuestModal from '../Quest/QuestModal'; 

import inventoryBtnImg from "../../assets/button/inventoryBtn.png";
import shopBtnImg from "../../assets/button/shopBtn.png";
import plantbookBtnImg from '../../assets/button/plantbookBtn.png';
import friendBtnImg from '../../assets/button/friendBtn.png';
import dailyquestBtnImg from '../../assets/button/dailyquestBtn.png';
import longquestBtnImg from '../../assets/button/longquestBtn.png';

import img7AM8AM from '../../assets/images/background/7AM-8AM.jpg';
import img9AM12PM from '../../assets/images/background/9AM-12PM.jpg';
import img13PM16PM from '../../assets/images/background/13PM-16PM.jpg';
import img16PM18PM from '../../assets/images/background/16PM-18PM.jpg';
import img18PM19PM from '../../assets/images/background/18PM-19PM.jpg';
import img20PM from '../../assets/images/background/20PM-.jpg';

import rain from '../../assets/images/background/rain_b.png';
import snow from '../../assets/images/background/snow_b.png';

const Main = () => {
  const navigate = useNavigate();

  // useState
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isPlantBookModalOpen, setIsPlantBookModalOpen] = useState(false); 
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false); 
  const [isDailyQuestModalOpen, setIsDailyQuestModalOpen] = useState(false); 
  const [isLongTermQuestModalOpen, setIsLongTermQuestModalOpen] = useState(false); 
  const [backgroundImage, setBackgroundImage] = useState(''); 
  const [overlayImage, setOverlayImage] = useState(''); 
  const plantsRef = useRef(null); // Plants 컴포넌트의 ref
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  
  // 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/main/info', { withCredentials: true });
        setData(response.data); // 데이터 상태 업데이트

        // 강수 타입에 따른 오버레이 이미지 설정
        const precipitationType = response.data.weather?.precipitationType;
        if (precipitationType === '1' || precipitationType === '2') {
          setOverlayImage(rain);
        } else if (precipitationType === '3') {
          setOverlayImage(snow);
        } else {
          setOverlayImage(''); // 강수 없음
        }

        setIsModalOpen(response.data.user && !response.data.user.userName); // 닉네임 설정 여부 확인

      } catch (error) {
        console.error('데이터 가져오기 오류:', error.response?.data || error.message);
        
        // 오류 메시지 처리
        if (error.response?.data?.message?.includes('Weather API 요청이 3번 실패')) {
          alert('현재 기상청 서비스에 문제가 있습니다.\n잠시 후 다시 이용해주세요.');
        } else {
          alert('데이터를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
          navigate('/login'); // 오류 시 로그인 페이지로 이동
        }
      }
    };

    fetchMainData();
  }, [navigate]);

  // 시간대에 따라 배경 이미지 변경
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 7 && currentHour < 9) setBackgroundImage(img7AM8AM);
    else if (currentHour >= 9 && currentHour < 13) setBackgroundImage(img9AM12PM);
    else if (currentHour >= 13 && currentHour < 16) setBackgroundImage(img13PM16PM);
    else if (currentHour >= 16 && currentHour < 18) setBackgroundImage(img16PM18PM);
    else if (currentHour >= 18 && currentHour < 20) setBackgroundImage(img18PM19PM);
    else setBackgroundImage(img20PM);
  }, []);

  useEffect(() => {
  }, [selectedLocation, selectedName]);

  
  if (!data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        로딩 중...
      </div>
    );
  }

  const { user, weather, farm, plants } = data;

  const handleSetUsername = (newUsername) => {
    user.userName = newUsername; // 닉네임 업데이트
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setData((prevData) => ({
      ...prevData,
      user: {
        ...prevData.user,
        ...updatedData,
      },
      farm: {
        ...prevData.farm,
        ...updatedData.farm,
      },
    }));
  };
  
  // Plants 컴포넌트의 선택 버튼 활성화 함수 호출
  const activateChoiceForEmptySlots = (callback) => {
    if (plantsRef.current) {
      console.log("PlantsRef exists:", plantsRef.current);
      plantsRef.current.activateChoiceForEmptySlots(callback);
    } else {
      console.warn("plantsRef.current is null");
    }
  };  

  const activateChoiceForActiveSlots = (callback) => {
    if (plantsRef.current) {
      plantsRef.current.activateChoiceForActiveSlots(callback); // Plants 컴포넌트의 함수 호출
    }
  };

  const handlePlantSelected = (location, plantName) => {
    setSelectedLocation(location);
    setSelectedName(plantName);
    console.log(`위치: ${location}, 이름: ${plantName}`);
  };
  
  return (
    <div className="main-container" style={{ backgroundImage: `url(${backgroundImage})` }} >
    {/* 강수 타입에 따른 오버레이 이미지 */}
    {overlayImage && (
      <div
        className={`overlay-image ${weather.precipitationType === '1' || weather.precipitationType === '2' ? 'rain-animation' : 'snow-animation'}`}
        style={{ backgroundImage: `url(${overlayImage})` }}
      ></div>
    )}

      <div className="bottom-image"></div>

      <div className="upper-container">
        <Profile user={user} onProfileClick={() => setIsProfileModalOpen(true)} />
        <BalanceBar user={user} />
        <div className="main-weather-container">
          <Weather weather={weather} />
        </div>
      </div>

      <div className='center-container'>
        <Farm farm={farm} />
        <Plants
          plants={plants}
          ref={plantsRef}
          onPlantSelected={handlePlantSelected}
        />
      </div>

      <div className="left-container">
        <div className='btn-container'>
          {/* Inventory 버튼 */}
          <button onClick={() => setIsInventoryModalOpen(true)}>
            <img
              src={inventoryBtnImg}
              alt="인벤토리 버튼"
              style={{ width: 'auto', height: '70px', border: 'none', cursor: 'pointer' }}
            />
          </button>

          {/* Shop 버튼 */}
          <button onClick={() => navigate('/shop')}>
            <img
              src={shopBtnImg}
              alt="샵 버튼"
              style={{ width: 'auto', height: '70px', border: 'none', cursor: 'pointer' }}
            />
          </button>

          {/* PlantBook 버튼 */}
          <button onClick={() => setIsPlantBookModalOpen(true)}>
            <img
              src={plantbookBtnImg}
              alt="플랜트북 버튼"
              style={{ width: 'auto', height: '70px', border: 'none', cursor: 'pointer' }}
            />
          </button>
        </div>
      </div>

      <div className="right-container">
        {/* Daily Quest 버튼 */}
        <button onClick={() => setIsDailyQuestModalOpen(true)}>
          <img
            src={dailyquestBtnImg}
            alt="일일 퀘스트 버튼"
            style={{ width: 'auto', height: '60px', border: 'none', cursor: 'pointer' }}
          />
        </button>

        {/* Long Term Quest 버튼 */}
        <button onClick={() => setIsLongTermQuestModalOpen(true)}>
          <img
            src={longquestBtnImg}
            alt="장기 퀘스트 버튼"
            style={{ width: 'auto', height: '60px', border: 'none', cursor: 'pointer' }}
          />
        </button>
      </div>

      <div className='bottom-container'>
        {/* Friend 버튼 */}
        <button onClick={() => setIsFriendModalOpen(true)}>
          <img
            src={friendBtnImg}
            alt="친구 버튼"
              style={{ width: '200px', height: 'auto', border: 'none', cursor: 'pointer' }}
            />
          </button>
        </div>

      {isModalOpen && <UsernameModal onSetUsername={handleSetUsername} />}
      {isPlantBookModalOpen && <PlantBookModal onClose={() => setIsPlantBookModalOpen(false)} />}
      {isFriendModalOpen && <FriendModal onClose={() => setIsFriendModalOpen(false)} />}

      {isInventoryModalOpen && (
  <InventoryModal
    plants={plants}
    activateChoiceForEmptySlots={(callback) =>
      plantsRef.current?.activateChoiceForEmptySlots(callback)
    }
    activateChoiceForActiveSlots={(callback) =>
      plantsRef.current?.activateChoiceForActiveSlots(callback)
    }
    selectedLocation={selectedLocation}
    selectedName={selectedName}
    onClose={() => setIsInventoryModalOpen(false)}
  />
)}


      {/* Daily Quest 모달 */}
      {isDailyQuestModalOpen && (
        <QuestModal
          type="DAILY"
          onClose={() => setIsDailyQuestModalOpen(false)}
        />
      )}

      {/* Long Term Quest 모달 */}
      {isLongTermQuestModalOpen && (
        <QuestModal
          type="LONGTERM"
          onClose={() => setIsLongTermQuestModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          farm={farm}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdate={handleProfileUpdate} // 추가
        />
      )}
    </div>
  );
};

export default Main;
