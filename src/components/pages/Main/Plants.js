import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './Plants.css';
import PlantNullImg from '../../assets/images/plant/plant-null.png';
import choiceBtnImg from '../../assets/button/choiceBtn.png';
import PlantNameModal from '../Inventory/PlantNameModal';
import PlantModal from '../Plant/PlantModal';


const Plants = forwardRef(({ plants = [], onPlantSelected }, ref) => {
  const [choiceButtons, setChoiceButtons] = useState({
    left: false,
    center: false,
    right: false,
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isForEmptySlot, setIsForEmptySlot] = useState(false); // 선택 동작 구분 플래그
  const [callback, setCallback] = useState(null); // 콜백 저장 상태
  const [selectedPlant, setSelectedPlant] = useState(null); // PlantModal 상태 추가

  const locations = ['left', 'center', 'right'];

  const plantsByLocation = locations.map((location) => {
    return plants.find((plant) => plant.plantLocation === location) || null;
  });

  const activateChoiceForEmptySlots = (callbackFunction) => {
    setCallback(() => callbackFunction); // 콜백 저장
    setIsForEmptySlot(true); // 빈 슬롯 선택 모드 활성화

    const updatedButtons = { ...choiceButtons };
    plantsByLocation.forEach((plant, index) => {
      if (!plant) {
        updatedButtons[locations[index]] = true;
      }
    });
    setChoiceButtons(updatedButtons);
  };

  const activateChoiceForActiveSlots = (callbackFunction) => {
    setCallback(() => callbackFunction); // 콜백 저장
    setIsForEmptySlot(false); // 활성화된 슬롯 선택 모드 활성화

    const updatedButtons = { ...choiceButtons };
    plantsByLocation.forEach((plant, index) => {
      if (plant) {
        updatedButtons[locations[index]] = true;
      }
    });
    setChoiceButtons(updatedButtons);
  };

  useImperativeHandle(ref, () => ({
    activateChoiceForEmptySlots,
    activateChoiceForActiveSlots,
  }));

  const handleChoiceClick = (location) => {
    setSelectedLocation(location);

    if (isForEmptySlot) {
      setIsNameModalOpen(true); // 이름 입력 모달 열기
    } else {
      if (typeof callback === "function") {
        callback(location, null); // 이름 없이 위치 전달
        resetChoiceButtons(); // 선택 버튼 초기화
      } else {
        console.warn("Callback is not defined");
      }
    }
  };

  const handleNameSubmit = (plantName) => {
    if (typeof callback === "function") {
      callback(selectedLocation, plantName); // 위치와 이름 전달
    }
    if (typeof onPlantSelected === 'function') {
      onPlantSelected(selectedLocation, plantName); // 외부 콜백 실행
    }
    setIsNameModalOpen(false);
    resetChoiceButtons(); // 선택 버튼 초기화
  };

  const resetChoiceButtons = () => {
    setChoiceButtons({ left: false, center: false, right: false }); // 선택 버튼 초기화
    setCallback(null); // 콜백 초기화
  };

  const handlePlantClick = (plant) => {
    if (plant) {
      setSelectedPlant(plant); // PlantModal 열기
    }
  };

  const handleClosePlantModal = () => {
    setSelectedPlant(null); // PlantModal 닫기
  };

  return (
    <div className="plants-container">
      {plantsByLocation.map((plant, index) => (
        <div key={index} className={`plant-slot ${
              plant?.plantLocation === 'center' ? 'center-plant' : ''
            }`}>
          <button
            className="plant-button"
            onClick={() => handlePlantClick(plant)} // PlantModal 열기 처리
            disabled={!plant}
          >
            <img
              src={
                plant?.plantImage
                  ? `http://localhost:8080${plant.plantImage}`
                  : PlantNullImg
              }
              alt={plant?.plantName || 'Empty Plant Slot'}
              className="plant-image"
            />
          </button>

          {choiceButtons[locations[index]] && (
            <button
              className="choice-button"
              onClick={() => handleChoiceClick(locations[index])}
            >
              <img src={choiceBtnImg} alt="선택 버튼" className="choice-button-image" />
            </button>
          )}
        </div>
      ))}
      {isNameModalOpen && (
        <PlantNameModal
          onSubmit={handleNameSubmit}
          onClose={() => {
            setIsNameModalOpen(false);
            resetChoiceButtons();
          }}
        />
      )}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={handleClosePlantModal}
        />
      )}
    </div>
  );
});

export default Plants;
