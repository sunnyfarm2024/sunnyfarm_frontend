import React from 'react';
import './PlantModal.css'; // CSS 파일 연결

const PlantModal = ({ plant, onClose }) => {
  if (!plant) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{plant.plantName}</h2>
        <p>Type: {plant.plantType}</p>
        <p>Growth Stage: {plant.growthStage}</p>
        <p>Water Level: {plant.waterLevel}</p>
        <p>Lives Left: {plant.livesLeft}</p>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default PlantModal;
