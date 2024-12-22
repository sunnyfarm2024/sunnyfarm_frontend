import React from 'react';

const QuestModal = ({ type, onClose }) => {
  const title = type === "DAILY" ? "일일 퀘스트" : "장기 퀘스트";

  return (
    <div style={modalStyle}>
      <h2>{title}</h2>
      <p>{type === "DAILY" ? "오늘의 퀘스트를 완료하세요!" : "장기 목표를 달성하세요!"}</p>
      <button onClick={onClose} style={buttonStyle}>닫기</button>
    </div>
  );
};

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

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default QuestModal;
