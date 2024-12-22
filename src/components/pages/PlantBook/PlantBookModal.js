import React from 'react';

const PlantBookModal = ({ plants, onClose }) => {
  if (!plants || plants.length === 0) {
    return (
      <div style={modalStyle}>
        <h2>식물 정보</h2>
        <p>표시할 식물이 없습니다.</p>
        <button onClick={onClose} style={buttonStyle}>닫기</button>
      </div>
    );
  }

  return (
    <div style={modalStyle}>
      <h2>식물 도감</h2>
      <ul style={listStyle}>
        {plants.map((plant) => (
          <li key={plant.id} style={listItemStyle}>
            <h3>{plant.name}</h3>
            <p>{plant.description}</p>
          </li>
        ))}
      </ul>
      <button onClick={onClose} style={buttonStyle}>닫기</button>
    </div>
  );
};

// 간단한 스타일링
const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  width: '300px',
  textAlign: 'center',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: '20px 0',
};

const listItemStyle = {
  marginBottom: '15px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  textAlign: 'left',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default PlantBookModal;
