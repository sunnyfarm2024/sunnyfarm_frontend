import React, { useState } from "react";
import "./PlantNameModal.css";

const PlantNameModal = ({ onClose, onSubmit }) => {
  const [plantName, setPlantName] = useState("");

  const handleSubmit = () => {
    if (!plantName.trim()) {
      alert("식물 이름을 입력해주세요.");
      return;
    }
    onSubmit(plantName);
    onClose();
  };

  return (
    <div className="plant-name-modal-overlay">
      <div className="plant-name-modal">
        <h3>식물 이름 입력</h3>
        <input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="식물 이름을 입력하세요"
          className="plant-name-input"
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="submit-button">
            확인
          </button>
          <button onClick={onClose} className="cancel-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantNameModal;
