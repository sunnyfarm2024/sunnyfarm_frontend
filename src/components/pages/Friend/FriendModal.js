import React, { useState } from 'react';

const FriendModal = ({ onClose, onAddFriend, onRemoveFriend }) => {
  const [friends, setFriends] = useState([
    { id: 1, name: '철수' },
    { id: 2, name: '영희' },
  ]); // 고정된 더미 데이터

  const handleAddFriend = () => {
    const newFriend = { id: Date.now(), name: `새 친구 ${friends.length + 1}` };
    setFriends([...friends, newFriend]); // 새 친구 추가
  };

  const handleRemoveFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id)); // 친구 삭제
  };

  if (!friends || friends.length === 0) {
    return (
      <div style={modalStyle}>
        <h2>친구 목록</h2>
        <p>친구가 없습니다.</p>
        <button onClick={onClose} style={buttonStyle}>닫기</button>
      </div>
    );
  }

  return (
    <div style={modalStyle}>
      <h2>친구 목록</h2>
      <ul style={listStyle}>
        {friends.map((friend) => (
          <li key={friend.id} style={listItemStyle}>
            <span>{friend.name}</span>
            <button
              onClick={() => handleRemoveFriend(friend.id)}
              style={removeButtonStyle}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddFriend} style={addButtonStyle}>친구 추가</button>
      <button onClick={onClose} style={buttonStyle}>닫기</button>
    </div>
  );
};

// 스타일 정의
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
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const addButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#2196F3',
};

const removeButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

export default FriendModal;
