import React from 'react';
import waterbarImg from '../../assets/images/main/water_bar.png';
import coinbarImg from '../../assets/images/main/coin_bar.png';
import diabarImg from '../../assets/images/main/dia_bar.png';
import './BalanceBar.css'; // CSS 파일 불러오기

const BalanceBar = ({ user }) => {
  const { waterBalance, coinBalance, diamondBalance } = user;

  return (
    <div className="balance-container">
      {/* Water Balance */}
<div className="balance-bar">
  <img src={waterbarImg} alt="Water Bar" className="balance-image" />
  <span
    className="water-balance-text text-outline"
    data-content={`10/${waterBalance}`} // data-content에도 추가
  >
    {`10/${waterBalance}`}
  </span>
</div>

      {/* Coin Balance */}
      <div className="balance-bar">
        <img src={coinbarImg} alt="Coin Bar" className="balance-image" />
        <span className="balance-text text-outline" data-content={coinBalance}>
          {coinBalance}
        </span>
      </div>

      {/* Diamond Balance */}
      <div className="balance-bar">
        <img src={diabarImg} alt="Diamond Bar" className="balance-image" />
        <span className="balance-text text-outline" data-content={diamondBalance}>
          {diamondBalance}
        </span>
      </div>
    </div>
  );
};

export default BalanceBar;
