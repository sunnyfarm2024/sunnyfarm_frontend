import React from "react";
import ReactDOM from "react-dom";
import "./InventoryDetailsModal.css";
import closeBtn from "../../assets/button/closeBtn.png";
import deleteBtn from "../../assets/images/inventory/deleteBtn.png";
import useBtn from "../../assets/images/inventory/useBtn.png";
import noneUseBtn from "../../assets/images/inventory/none-useBtn.png";

const InventoryDetailsModal = ({ selectedItem, onClose, onUseItem, onDiscardItem }) => {
  if (!selectedItem) return null;

  return ReactDOM.createPortal(
    <div className="inventory-details-modal-overlay">
      <div className="inventory-details-modal">
        {/* 닫기 버튼 */}
        <button className="inventory-details-modal-close" onClick={onClose}>
          <img src={closeBtn} alt="닫기 버튼" />
        </button>

        {/* 항목 정보 */}
        <div className="item-info">
          {selectedItem.inventoryItemImg ? (
            <img
              className="itemImg"
              src={`http://localhost:8080${selectedItem.inventoryItemImg}`}
              alt={selectedItem.inventoryItemName}
            />
          ) : (
            <div
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              이미지 없음
            </div>
          )}
          <div className="inventory-item-description">
            <h3>{selectedItem.inventoryItemName}</h3>
            <p>{selectedItem.inventoryItemDescription}</p>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="button-container">
          {/* 버리기 버튼 */}
          <button onClick={onDiscardItem} className="discard-btn">
            <img
              src={deleteBtn}
              alt="버리기 버튼"
              className="button-image"
            />
          </button>

          {/* 사용하기 버튼 */}
          <button
            onClick={onUseItem}
            className="use-btn"
            disabled={!selectedItem.inventoryItemStatus}
          >
            <img
              src={selectedItem.inventoryItemStatus ? useBtn : noneUseBtn} // 비활성화 상태에 따라 이미지 변경
              alt={selectedItem.inventoryItemStatus ? "사용하기 버튼" : "사용 불가 버튼"}
              className="button-image"
            />
          </button>

        </div>
      </div>
    </div>,
    document.body // 상세 모달을 body에 렌더링
  );
};

export default InventoryDetailsModal;
