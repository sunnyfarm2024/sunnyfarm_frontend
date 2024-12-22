import React, { useState } from 'react';

const Shop = () => {
  // 샘플 아이템 데이터
  const [items] = useState([
    { id: 1, name: 'Health Potion', price: 100 },
    { id: 2, name: 'Mana Potion', price: 150 },
    { id: 3, name: 'Sword of Power', price: 1000 },
    { id: 4, name: 'Shield of Defense', price: 800 },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(2000); // 사용자 잔액 예제

  // 아이템 구매 처리
  const handleBuy = (item) => {
    if (balance >= item.price) {
      setBalance(balance - item.price);
      alert(`${item.name}을(를) 구매하셨습니다!`);
    } else {
      alert('잔액이 부족합니다!');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Shop</h1>
      <p>여기에서 아이템을 구매할 수 있습니다!</p>
      <div>
        <h3>현재 잔액: {balance} 골드</h3>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>아이템 목록</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <p>{item.price} 골드</p>
              </div>
              <button
                onClick={() => handleBuy(item)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                구매
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedItem && (
        <div style={{ marginTop: '20px' }}>
          <h3>선택한 아이템</h3>
          <p>{selectedItem.name}</p>
          <p>가격: {selectedItem.price} 골드</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
